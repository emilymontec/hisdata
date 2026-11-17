import { api } from './api';

export interface Prescription {
  id: string;
  status: string;
  createdAt: string;
  items: {
    id: string;
    freeTextDrug?: string;
    medication?: { id: string; name: string };
    dosageInstructions: string;
  }[];
}

export interface CreatePrescriptionInput {
  patientId: string;
  consultationId?: string;
  items: { freeTextDrug: string; dosageInstructions: string }[];
}

export async function listPrescriptionsByPatient(patientId: string): Promise<Prescription[]> {
  const { data } = await api.get(`/prescriptions/paciente/${patientId}`);
  return data;
}

export async function createPrescription(input: CreatePrescriptionInput): Promise<Prescription> {
  const { data } = await api.post('/prescriptions', input);
  return data;
}

export async function cancelPrescription(id: string): Promise<Prescription> {
  const { data } = await api.patch(`/prescriptions/${id}/cancelar`);
  return data;
}
