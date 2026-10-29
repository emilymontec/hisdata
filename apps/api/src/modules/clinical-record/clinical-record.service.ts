import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { AddClinicalNoteDto } from './dto/add-note.dto';
import { AddDiagnosisDto } from './dto/add-diagnosis.dto';

/**
 * Módulo 4 — Historia clínica electrónica.
 * Las estructuras de firma clínica, corrección de notas y codificación diagnóstica oficial
 * quedan pendientes de definición con responsables sanitarios (ver docs/gestion/decisiones-pendientes.md).
 * Esta versión cubre: registro/consulta de notas y diagnósticos, y trazabilidad de todo acceso.
 */
@Injectable()
export class ClinicalRecordService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async getOrCreateForPatient(patientId: string) {
    const existing = await this.prisma.clinicalRecord.findUnique({ where: { patientId } });
    if (existing) return existing;
    return this.prisma.clinicalRecord.create({ data: { patientId } });
  }

  async view(patientId: string, actorUserId: string) {
    const record = await this.prisma.clinicalRecord.findUnique({
      where: { patientId },
      include: {
        notes: { orderBy: { createdAt: 'desc' } },
        diagnoses: { orderBy: { createdAt: 'desc' } },
      },
    });
    if (!record) throw new NotFoundException('El paciente aún no tiene historia clínica registrada.');

    // Toda lectura de historia clínica se audita (dato sensible, trazabilidad obligatoria).
    await this.auditService.record({
      actorUserId,
      action: 'CLINICAL_RECORD_READ',
      entityType: 'ClinicalRecord',
      entityId: record.id,
    });

    return record;
  }

  async addNote(patientId: string, dto: AddClinicalNoteDto, actorUserId: string) {
    const record = await this.getOrCreateForPatient(patientId);
    const note = await this.prisma.clinicalNote.create({
      data: { clinicalRecordId: record.id, authorId: actorUserId, content: dto.content },
    });

    await this.auditService.record({
      actorUserId,
      action: 'CLINICAL_NOTE_CREATE',
      entityType: 'ClinicalNote',
      entityId: note.id,
    });

    return note;
  }

  async addDiagnosis(patientId: string, dto: AddDiagnosisDto, actorUserId: string) {
    const record = await this.getOrCreateForPatient(patientId);
    const diagnosis = await this.prisma.diagnosis.create({
      data: {
        clinicalRecordId: record.id,
        registeredById: actorUserId,
        description: dto.description,
        code: dto.code,
        codeSystem: dto.codeSystem,
      },
    });

    await this.auditService.record({
      actorUserId,
      action: 'DIAGNOSIS_CREATE',
      entityType: 'Diagnosis',
      entityId: diagnosis.id,
    });

    return diagnosis;
  }
}
