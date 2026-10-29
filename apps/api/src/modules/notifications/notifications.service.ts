import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async create(dto: CreateNotificationDto, actorUserId: string) {
    if (!dto.recipientPatientId && !dto.recipientUserId) {
      throw new BadRequestException('Debe indicar un destinatario (paciente o usuario interno).');
    }

    // El canal EMAIL solo registra la intención: el envío real requiere configurar y
    // autorizar un canal externo (módulo 19, pendiente de aprobación).
    const notification = await this.prisma.notification.create({
      data: {
        recipientPatientId: dto.recipientPatientId,
        recipientUserId: dto.recipientUserId,
        channel: dto.channel ?? 'IN_APP',
        title: dto.title,
        body: dto.body,
      },
    });

    await this.auditService.record({
      actorUserId,
      action: 'NOTIFICATION_CREATE',
      entityType: 'Notification',
      entityId: notification.id,
    });

    return notification;
  }

  async findForUser(userId: string) {
    return this.prisma.notification.findMany({
      where: { recipientUserId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findForPatient(patientId: string) {
    return this.prisma.notification.findMany({
      where: { recipientPatientId: patientId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markRead(id: string) {
    const notification = await this.prisma.notification.findUnique({ where: { id } });
    if (!notification) throw new NotFoundException('Notificación no encontrada.');
    return this.prisma.notification.update({ where: { id }, data: { readAt: new Date() } });
  }
}
