import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

export interface AuditEntry {
  actorUserId?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  ipAddress?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Registro de auditoría de operaciones sensibles (módulo 18).
 * Regla: nunca incluir contenido clínico completo ni credenciales en 'metadata',
 * solo identificadores y datos estrictamente necesarios para trazabilidad.
 */
@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async record(entry: AuditEntry): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        actorUserId: entry.actorUserId,
        action: entry.action,
        entityType: entry.entityType,
        entityId: entry.entityId,
        ipAddress: entry.ipAddress,
        metadata: entry.metadata as any,
      },
    });
  }

  async findByEntity(entityType: string, entityId: string) {
    return this.prisma.auditLog.findMany({
      where: { entityType, entityId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
