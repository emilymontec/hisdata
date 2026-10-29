import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';

/**
 * Módulo 11 — Prescripciones médicas.
 * Cubre registro, consulta y estados. Las reglas clínicas (interacciones medicamentosas,
 * dosis máximas, contraindicaciones) NO están implementadas: requieren validación y
 * aprobación de un responsable clínico antes de automatizarse.
 */
@Injectable()
export class PrescriptionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async create(dto: CreatePrescriptionDto, prescribedById: string) {
    for (const item of dto.items) {
      if (!item.medicationId && !item.freeTextDrug) {
        throw new BadRequestException(
          'Cada ítem debe indicar un medicamento del catálogo o un nombre de medicamento en texto libre.',
        );
      }
    }

    const prescription = await this.prisma.prescription.create({
      data: {
        patientId: dto.patientId,
        consultationId: dto.consultationId,
        prescribedById,
        items: {
          create: dto.items.map((item) => ({
            medicationId: item.medicationId,
            freeTextDrug: item.freeTextDrug,
            dosageInstructions: item.dosageInstructions,
          })),
        },
      },
      include: { items: true },
    });

    await this.auditService.record({
      actorUserId: prescribedById,
      action: 'PRESCRIPTION_CREATE',
      entityType: 'Prescription',
      entityId: prescription.id,
    });

    return prescription;
  }

  async findByPatient(patientId: string) {
    return this.prisma.prescription.findMany({
      where: { patientId },
      include: { items: { include: { medication: true, dispensations: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const prescription = await this.prisma.prescription.findUnique({
      where: { id },
      include: { items: { include: { medication: true, dispensations: true } } },
    });
    if (!prescription) throw new NotFoundException('Prescripción no encontrada.');
    return prescription;
  }

  async cancel(id: string, actorUserId: string) {
    const prescription = await this.prisma.prescription.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    await this.auditService.record({
      actorUserId,
      action: 'PRESCRIPTION_CANCEL',
      entityType: 'Prescription',
      entityId: id,
    });

    return prescription;
  }
}
