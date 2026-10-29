import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateAdmissionDto } from './dto/create-admission.dto';
import { TransferDto } from './dto/transfer.dto';

@Injectable()
export class AdmissionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async create(dto: CreateAdmissionDto, actorUserId: string) {
    if (dto.bedId) {
      await this.assertBedAvailable(dto.bedId);
    }

    const admission = await this.prisma.$transaction(async (tx) => {
      const created = await tx.admission.create({
        data: { patientId: dto.patientId, bedId: dto.bedId },
      });
      if (dto.bedId) {
        await tx.bed.update({ where: { id: dto.bedId }, data: { isOccupied: true } });
      }
      return created;
    });

    await this.auditService.record({
      actorUserId,
      action: 'ADMISSION_CREATE',
      entityType: 'Admission',
      entityId: admission.id,
    });

    return admission;
  }

  async transfer(admissionId: string, dto: TransferDto, actorUserId: string) {
    const admission = await this.getActiveOrFail(admissionId);
    await this.assertBedAvailable(dto.toBedId);

    const operations: any[] = [];
    if (admission.bedId) {
      operations.push(
        this.prisma.bed.update({ where: { id: admission.bedId }, data: { isOccupied: false } }),
      );
    }
    operations.push(
      this.prisma.bed.update({ where: { id: dto.toBedId }, data: { isOccupied: true } }),
      this.prisma.admission.update({
        where: { id: admission.id },
        data: { bedId: dto.toBedId, status: 'TRANSFERRED' },
      }),
      this.prisma.transfer.create({
        data: {
          admissionId: admission.id,
          fromBedId: admission.bedId,
          toBedId: dto.toBedId,
          reason: dto.reason,
        },
      }),
    );

    const results = await this.prisma.$transaction(operations);
    const transfer = results[results.length - 1];

    await this.auditService.record({
      actorUserId,
      action: 'ADMISSION_TRANSFER',
      entityType: 'Admission',
      entityId: admission.id,
    });

    return transfer;
  }

  async discharge(admissionId: string, actorUserId: string) {
    const admission = await this.getActiveOrFail(admissionId);

    const operations: any[] = [];
    if (admission.bedId) {
      operations.push(
        this.prisma.bed.update({ where: { id: admission.bedId }, data: { isOccupied: false } }),
      );
    }
    operations.push(
      this.prisma.admission.update({
        where: { id: admission.id },
        data: { status: 'DISCHARGED', dischargedAt: new Date() },
      }),
    );

    const results = await this.prisma.$transaction(operations);
    const updated = results[results.length - 1];

    await this.auditService.record({
      actorUserId,
      action: 'ADMISSION_DISCHARGE',
      entityType: 'Admission',
      entityId: admission.id,
    });

    return updated;
  }

  async bedAvailability() {
    return this.prisma.ward.findMany({
      include: { beds: { orderBy: { code: 'asc' } } },
    });
  }

  private async assertBedAvailable(bedId: string) {
    const bed = await this.prisma.bed.findUnique({ where: { id: bedId } });
    if (!bed) throw new NotFoundException('Cama no encontrada.');
    if (bed.isOccupied) throw new BadRequestException('La cama seleccionada ya está ocupada.');
  }

  private async getActiveOrFail(admissionId: string) {
    const admission = await this.prisma.admission.findUnique({ where: { id: admissionId } });
    if (!admission) throw new NotFoundException('Admisión no encontrada.');
    if (admission.status === 'DISCHARGED') {
      throw new BadRequestException('La admisión ya fue egresada.');
    }
    return admission;
  }
}
