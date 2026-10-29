import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { RegisterLabResultDto } from './dto/register-result.dto';

/**
 * Módulo 9 — Laboratorio clínico.
 * Pendiente de definición con el responsable de laboratorio: perfil/rol específico de
 * "técnico de laboratorio" (hoy se reutiliza ENFERMERIA/MEDICO) y reglas formales de
 * validación clínica de resultados antes de publicarlos.
 */
@Injectable()
export class LaboratoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async registerSampleCollected(labRequestId: string, actorUserId: string) {
    const request = await this.getOrFail(labRequestId);
    const updated = await this.prisma.labRequest.update({
      where: { id: request.id },
      data: { status: 'SAMPLE_COLLECTED', sampleCollectedAt: new Date() },
    });

    await this.auditService.record({
      actorUserId,
      action: 'LAB_SAMPLE_COLLECTED',
      entityType: 'LabRequest',
      entityId: request.id,
    });

    return updated;
  }

  async registerResult(labRequestId: string, dto: RegisterLabResultDto, actorUserId: string) {
    const request = await this.getOrFail(labRequestId);

    const [result] = await this.prisma.$transaction([
      this.prisma.labResult.create({
        data: { labRequestId: request.id, ...dto },
      }),
      this.prisma.labRequest.update({
        where: { id: request.id },
        data: { status: 'RESULT_REGISTERED' },
      }),
    ]);

    await this.auditService.record({
      actorUserId,
      action: 'LAB_RESULT_REGISTER',
      entityType: 'LabResult',
      entityId: result.id,
    });

    return result;
  }

  async validateAndPublish(labRequestId: string, actorUserId: string) {
    const request = await this.getOrFail(labRequestId);
    if (request.status !== 'RESULT_REGISTERED') {
      throw new BadRequestException('Solo se pueden validar resultados ya registrados.');
    }

    const [, updatedRequest] = await this.prisma.$transaction([
      this.prisma.labResult.updateMany({
        where: { labRequestId: request.id },
        data: { validatedById: actorUserId, validatedAt: new Date() },
      }),
      this.prisma.labRequest.update({
        where: { id: request.id },
        data: { status: 'PUBLISHED' },
      }),
    ]);

    await this.auditService.record({
      actorUserId,
      action: 'LAB_RESULT_VALIDATE_PUBLISH',
      entityType: 'LabRequest',
      entityId: request.id,
    });

    return updatedRequest;
  }

  async findOne(id: string, actorUserId: string) {
    const request = await this.prisma.labRequest.findUnique({
      where: { id },
      include: { results: true },
    });
    if (!request) throw new NotFoundException('Solicitud de laboratorio no encontrada.');

    await this.auditService.record({
      actorUserId,
      action: 'LAB_RESULT_READ',
      entityType: 'LabRequest',
      entityId: id,
    });

    return request;
  }

  private async getOrFail(id: string) {
    const request = await this.prisma.labRequest.findUnique({ where: { id } });
    if (!request) throw new NotFoundException('Solicitud de laboratorio no encontrada.');
    return request;
  }
}
