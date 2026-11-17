import { api } from './api';

export interface Appointment {
  id: string;
  patientId: string;
  practitionerId: string;
  startsAt: string;
  endsAt: string;
  status: string;
  reason?: string;
}

export interface CreateAppointmentInput {
  patientId: string;
  practitionerId: string;
  startsAt: string;
  endsAt: string;
  reason?: string;
}

export async function listAppointmentsByPatient(patientId: string): Promise<Appointment[]> {
  const { data } = await api.get(`/appointments/paciente/${patientId}`);
  return data;
}

export async function createAppointment(input: CreateAppointmentInput): Promise<Appointment> {
  const { data } = await api.post('/appointments', input);
  return data;
}

export async function cancelAppointment(id: string): Promise<Appointment> {
  const { data } = await api.patch(`/appointments/${id}/cancelar`);
  return data;
}
