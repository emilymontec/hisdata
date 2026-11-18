import { BadRequestException } from '@nestjs/common';
import { AppointmentsService } from '../appointments.service';

function buildService(overlappingFound: boolean) {
  const prisma: any = {
    appointment: {
      findFirst: jest.fn().mockResolvedValue(overlappingFound ? { id: 'existing-appt' } : null),
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'new-appt', ...data })),
      findUnique: jest.fn(),
    },
  };
  const audit: any = { record: jest.fn().mockResolvedValue(undefined) };
  const service = new AppointmentsService(prisma, audit);
  return { service, prisma, audit };
}

describe('AppointmentsService.create', () => {
  const baseDto = {
    patientId: 'patient-1',
    practitionerId: 'practitioner-1',
    startsAt: '2026-12-01T10:00:00.000Z',
    endsAt: '2026-12-01T10:30:00.000Z',
  };

  it('rechaza la cita si la hora de fin no es posterior a la de inicio', async () => {
    const { service } = buildService(false);
    await expect(
      service.create({ ...baseDto, endsAt: baseDto.startsAt }, 'actor-1'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rechaza la cita si el profesional ya tiene una cita activa en ese horario', async () => {
    const { service } = buildService(true);
    await expect(service.create(baseDto, 'actor-1')).rejects.toBeInstanceOf(BadRequestException);
  });

  it('crea la cita y audita la acción cuando no hay solapamiento', async () => {
    const { service, prisma, audit } = buildService(false);
    const appointment = await service.create(baseDto, 'actor-1');

    expect(appointment).toMatchObject({ patientId: 'patient-1', practitionerId: 'practitioner-1' });
    expect(prisma.appointment.create).toHaveBeenCalledTimes(1);
    expect(audit.record).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'APPOINTMENT_CREATE', actorUserId: 'actor-1' }),
    );
  });
});
