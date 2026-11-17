import { api } from './api';

export interface MedicalOrder {
  id: string;
  type: 'LABORATORY' | 'IMAGING' | 'PROCEDURE';
  description: string;
  status: string;
  createdAt: string;
  labRequest?: { id: string; status: string };
  imagingRequest?: { id: string; status: string; modality: string };
}

export interface CreateOrderInput {
  patientId: string;
  consultationId?: string;
  type: 'LABORATORY' | 'IMAGING' | 'PROCEDURE';
  description: string;
  imagingModality?: string;
}

export async function listOrdersByPatient(patientId: string): Promise<MedicalOrder[]> {
  const { data } = await api.get(`/medical-orders/paciente/${patientId}`);
  return data;
}

export async function createOrder(input: CreateOrderInput): Promise<MedicalOrder> {
  const { data } = await api.post('/medical-orders', input);
  return data;
}
