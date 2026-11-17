import { api } from './api';

export interface Bed {
  id: string;
  code: string;
  isOccupied: boolean;
}

export interface Ward {
  id: string;
  name: string;
  beds: Bed[];
}

export interface Admission {
  id: string;
  status: string;
  admittedAt: string;
  dischargedAt?: string;
  bedId?: string;
}

export async function bedAvailability(): Promise<Ward[]> {
  const { data } = await api.get('/admissions/camas/disponibilidad');
  return data;
}

export async function createAdmission(input: { patientId: string; bedId?: string }): Promise<Admission> {
  const { data } = await api.post('/admissions', input);
  return data;
}

export async function dischargeAdmission(id: string): Promise<Admission> {
  const { data } = await api.patch(`/admissions/${id}/egreso`);
  return data;
}
