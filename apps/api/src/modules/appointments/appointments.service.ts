import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { RescheduleAppointmentDto } from './dto/reschedule-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async create(dto: CreateAppointmentDto, actorUserId: string) {
    const startsAt = new Date(dto.startsAt);
    const endsAt = new Date(dto.endsAt);
    if (endsAt <= startsAt) {
      throw new BadRequestException('La hora de fin debe ser posterior a la hora de inicio.');
    }

    await this.assertNoOverlap(dto.practitionerId, startsAt, endsAt);

    const appointment = await this.prisma.appointment.create({
      data: {
        patientId: dto.patientId,
        practitionerId: dto.practitionerId,
        startsAt,
        endsAt,
        reason: dto.reason,
      },
    });

    await this.auditService.record({
      actorUserId,
      action: 'APPOINTMENT_CREATE',
      entityType: 'Appointment',
      entityId: appointment.id,
    });

    return appointment;
  }

  async findByPatient(patientId: string) {
    return this.prisma.appointment.findMany({
      where: { patientId },
      orderBy: { startsAt: 'desc' },
    });
  }

  async findByPractitionerAndRange(practitionerId: string, from: Date, to: Date) {
    return this.prisma.appointment.findMany({
      where: { practitionerId, startsAt: { gte: from }, endsAt: { lte: to } },
      orderBy: { startsAt: 'asc' },
    });
  }

  async cancel(id: string, actorUserId: string) {
    const appointment = await this.getOrFail(id);
    const updated = await this.prisma.appointment.update({
      where: { id: appointment.id },
      data: { status: 'CANCELLED' },
    });

    await this.auditService.record({
      actorUserId,
      action: 'APPOINTMENT_CANCEL',
      entityType: 'Appointment',
      entityId: id,
    });

    return updated;
  }

  async reschedule(id: string, dto: RescheduleAppointmentDto, actorUserId: string) {
    const original = await this.getOrFail(id);
    const newStartsAt = new Date(dto.newStartsAt);
    const newEndsAt = new Date(dto.newEndsAt);

    if (newEndsAt <= newStartsAt) {
      throw new BadRequestException('La hora de fin debe ser posterior a la hora de inicio.');
    }
    await this.assertNoOverlap(original.practitionerId, newStartsAt, newEndsAt, original.id);

    const [, newAppointment] = await this.prisma.$transaction([
      this.prisma.appointment.update({
        where: { id: original.id },
        data: { status: 'RESCHEDULED' },
      }),
      this.prisma.appointment.create({
        data: {
          patientId: original.patientId,
          practitionerId: original.practitionerId,
          startsAt: newStartsAt,
          endsAt: newEndsAt,
          reason: original.reason,
          rescheduledFromId: original.id,
        },
      }),
    ]);

    await this.auditService.record({
      actorUserId,
      action: 'APPOINTMENT_RESCHEDULE',
      entityType: 'Appointment',
      entityId: original.id,
      metadata: { nuevaCitaId: newAppointment.id },
    });

    return newAppointment;
  }

  async complete(id: string, actorUserId: string) {
    const appointment = await this.getOrFail(id);
    const updated = await this.prisma.appointment.update({
      where: { id: appointment.id },
      data: { status: 'COMPLETED' },
    });

    await this.auditService.record({
      actorUserId,
      action: 'APPOINTMENT_COMPLETE',
      entityType: 'Appointment',
      entityId: id,
    });

    return updated;
  }

  private async getOrFail(id: string) {
    const appointment = await this.prisma.appointment.findUnique({ where: { id } });
    if (!appointment) throw new NotFoundException('Cita no encontrada.');
    return appointment;
  }

  private async assertNoOverlap(
    practitionerId: string,
    startsAt: Date,
    endsAt: Date,
    excludeAppointmentId?: string,
  ) {
    const overlapping = await this.prisma.appointment.findFirst({
      where: {
        practitionerId,
        id: excludeAppointmentId ? { not: excludeAppointmentId } : undefined,
        status: { in: ['SCHEDULED', 'CONFIRMED'] },
        startsAt: { lt: endsAt },
        endsAt: { gt: startsAt },
      },
    });
    if (overlapping) {
      throw new BadRequestException('El profesional ya tiene una cita en ese horario.');
    }
  }
}
