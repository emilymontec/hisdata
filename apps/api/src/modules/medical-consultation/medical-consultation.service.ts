import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { ClinicalRecordService } from '../clinical-record/clinical-record.service';
import { CreateConsultationDto } from './dto/create-consultation.dto';

@Injectable()
export class MedicalConsultationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly clinicalRecordService: ClinicalRecordService,
  ) {}

  async create(dto: CreateConsultationDto, practitionerId: string) {
    const clinicalRecord = await this.clinicalRecordService.getOrCreateForPatient(dto.patientId);

    const consultation = await this.prisma.consultation.create({
      data: {
        clinicalRecordId: clinicalRecord.id,
        appointmentId: dto.appointmentId,
        practitionerId,
        reason: dto.reason,
        findings: dto.findings,
        plan: dto.plan,
      },
    });

    if (dto.appointmentId) {
      await this.prisma.appointment.update({
        where: { id: dto.appointmentId },
        data: { status: 'COMPLETED' },
      });
    }

    await this.auditService.record({
      actorUserId: practitionerId,
      action: 'CONSULTATION_CREATE',
      entityType: 'Consultation',
      entityId: consultation.id,
    });

    return consultation;
  }

  async findByPatient(patientId: string, actorUserId: string) {
    const clinicalRecord = await this.prisma.clinicalRecord.findUnique({ where: { patientId } });
    if (!clinicalRecord) return [];

    const consultations = await this.prisma.consultation.findMany({
      where: { clinicalRecordId: clinicalRecord.id },
      orderBy: { createdAt: 'desc' },
      include: { orders: true, prescriptions: true },
    });

    await this.auditService.record({
      actorUserId,
      action: 'CONSULTATION_LIST_READ',
      entityType: 'ClinicalRecord',
      entityId: clinicalRecord.id,
    });

    return consultations;
  }

  async findOne(id: string) {
    const consultation = await this.prisma.consultation.findUnique({
      where: { id },
      include: { orders: true, prescriptions: true },
    });
    if (!consultation) throw new NotFoundException('Consulta no encontrada.');
    return consultation;
  }
}
