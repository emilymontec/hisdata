import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { isLikelySamePerson } from './duplicate-detection.util';

@Injectable()
export class PatientsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async create(dto: CreatePatientDto, actorUserId: string) {
    const exactDuplicate = await this.prisma.patient.findUnique({
      where: {
        documentType_documentNumber: {
          documentType: dto.documentType,
          documentNumber: dto.documentNumber,
        },
      },
    });
    if (exactDuplicate) {
      throw new BadRequestException(
        'Ya existe un paciente registrado con ese tipo y número de documento.',
      );
    }

    // Heurística de posibles duplicados por nombre + fecha de nacimiento (no bloquea el registro,
    // solo lo señala para revisión del personal administrativo).
    const candidates = await this.prisma.patient.findMany({
      where: { lastName: { equals: dto.lastName, mode: 'insensitive' } },
    });
    const possibleDuplicate = candidates.find((c) =>
      isLikelySamePerson(
        { firstName: dto.firstName, lastName: dto.lastName, dateOfBirth: new Date(dto.dateOfBirth) },
        { firstName: c.firstName, lastName: c.lastName, dateOfBirth: c.dateOfBirth },
      ),
    );

    const patient = await this.prisma.patient.create({
      data: {
        documentType: dto.documentType,
        documentNumber: dto.documentNumber,
        firstName: dto.firstName,
        lastName: dto.lastName,
        dateOfBirth: new Date(dto.dateOfBirth),
        sex: dto.sex,
        phone: dto.phone,
        email: dto.email,
        address: dto.address,
        duplicateOfId: possibleDuplicate?.id,
      },
    });

    await this.auditService.record({
      actorUserId,
      action: 'PATIENT_CREATE',
      entityType: 'Patient',
      entityId: patient.id,
      metadata: possibleDuplicate ? { posibleDuplicadoDe: possibleDuplicate.id } : undefined,
    });

    return patient;
  }

  async search(query: string) {
    return this.prisma.patient.findMany({
      where: {
        OR: [
          { documentNumber: { contains: query, mode: 'insensitive' } },
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 25,
    });
  }

  async findOne(id: string) {
    const patient = await this.prisma.patient.findUnique({ where: { id } });
    if (!patient) throw new NotFoundException('Paciente no encontrado.');
    return patient;
  }

  async update(id: string, dto: UpdatePatientDto, actorUserId: string) {
    const data: Record<string, unknown> = { ...dto };
    if (dto.dateOfBirth) data.dateOfBirth = new Date(dto.dateOfBirth);

    const patient = await this.prisma.patient.update({ where: { id }, data });

    await this.auditService.record({
      actorUserId,
      action: 'PATIENT_UPDATE',
      entityType: 'Patient',
      entityId: id,
    });

    return patient;
  }

  /** Lista de pacientes marcados como posible duplicado, pendientes de revisión manual. */
  async listPendingDuplicateReview() {
    return this.prisma.patient.findMany({ where: { duplicateOfId: { not: null } } });
  }

  /** Confirma que dos registros NO son la misma persona (limpia la marca de duplicado). */
  async dismissDuplicateFlag(id: string, actorUserId: string) {
    const patient = await this.prisma.patient.update({
      where: { id },
      data: { duplicateOfId: null },
    });
    await this.auditService.record({
      actorUserId,
      action: 'PATIENT_DUPLICATE_FLAG_DISMISSED',
      entityType: 'Patient',
      entityId: id,
    });
    return patient;
  }
}
