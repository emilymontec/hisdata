import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';

/**
 * Módulo 15 — Certificados y remisiones.
 * Las plantillas formales por tipo de documento (incapacidad, remisión, etc.) y sus
 * requisitos legales quedan pendientes de definición; por ahora el contenido se registra
 * como texto libre aprobado por quien lo emite.
 */
@Injectable()
export class CertificatesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async create(dto: CreateCertificateDto, issuedById: string) {
    const certificate = await this.prisma.certificate.create({
      data: { ...dto, issuedById },
    });

    await this.auditService.record({
      actorUserId: issuedById,
      action: 'CERTIFICATE_CREATE',
      entityType: 'Certificate',
      entityId: certificate.id,
      metadata: { tipo: dto.type },
    });

    return certificate;
  }

  async findByPatient(patientId: string, actorUserId: string) {
    const certificates = await this.prisma.certificate.findMany({
      where: { patientId },
      orderBy: { createdAt: 'desc' },
    });

    await this.auditService.record({
      actorUserId,
      action: 'CERTIFICATE_LIST_READ',
      entityType: 'Patient',
      entityId: patientId,
    });

    return certificates;
  }

  async findOne(id: string) {
    const certificate = await this.prisma.certificate.findUnique({ where: { id } });
    if (!certificate) throw new NotFoundException('Documento no encontrado.');
    return certificate;
  }
}
