import { api } from './api';

export interface Consultation {
  id: string;
  reason: string;
  findings?: string;
  plan?: string;
  createdAt: string;
  orders: { id: string; type: string; status: string; description: string }[];
  prescriptions: { id: string; status: string }[];
}

export interface CreateConsultationInput {
  patientId: string;
  appointmentId?: string;
  reason: string;
  findings?: string;
  plan?: string;
}

export async function listConsultationsByPatient(patientId: string): Promise<Consultation[]> {
  const { data } = await api.get(`/consultations/paciente/${patientId}`);
  return data;
}

export async function createConsultation(input: CreateConsultationInput): Promise<Consultation> {
  const { data } = await api.post('/consultations', input);
  return data;
}
