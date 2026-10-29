import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateMedicalOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async create(dto: CreateMedicalOrderDto, requestedById: string) {
    if (dto.type === 'IMAGING' && !dto.imagingModality) {
      throw new BadRequestException('Debe indicar la modalidad de imagen (RX, TAC, RM, ECO, etc.).');
    }

    const order = await this.prisma.$transaction(async (tx) => {
      const created = await tx.medicalOrder.create({
        data: {
          patientId: dto.patientId,
          consultationId: dto.consultationId,
          requestedById,
          type: dto.type,
          description: dto.description,
        },
      });

      if (dto.type === 'LABORATORY') {
        await tx.labRequest.create({ data: { medicalOrderId: created.id } });
      } else if (dto.type === 'IMAGING') {
        await tx.imagingRequest.create({
          data: { medicalOrderId: created.id, modality: dto.imagingModality! },
        });
      }

      return created;
    });

    await this.auditService.record({
      actorUserId: requestedById,
      action: 'MEDICAL_ORDER_CREATE',
      entityType: 'MedicalOrder',
      entityId: order.id,
    });

    return order;
  }

  async findByPatient(patientId: string) {
    return this.prisma.medicalOrder.findMany({
      where: { patientId },
      include: { labRequest: { include: { results: true } }, imagingRequest: { include: { report: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.medicalOrder.findUnique({
      where: { id },
      include: { labRequest: { include: { results: true } }, imagingRequest: { include: { report: true } } },
    });
    if (!order) throw new NotFoundException('Orden médica no encontrada.');
    return order;
  }

  async updateStatus(id: string, status: 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED', actorUserId: string) {
    const order = await this.prisma.medicalOrder.update({ where: { id }, data: { status } });

    await this.auditService.record({
      actorUserId,
      action: 'MEDICAL_ORDER_STATUS_UPDATE',
      entityType: 'MedicalOrder',
      entityId: id,
      metadata: { nuevoEstado: status },
    });

    return order;
  }
}
