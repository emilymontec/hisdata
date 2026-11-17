import { api } from './api';

export interface Medication {
  id: string;
  name: string;
  presentation: string;
  stock: { id: string; batchNumber: string; quantity: number; expiresAt?: string }[];
}

export async function listCatalog(): Promise<Medication[]> {
  const { data } = await api.get('/pharmacy/medicamentos');
  return data;
}

export async function createMedication(input: { name: string; presentation: string }): Promise<Medication> {
  const { data } = await api.post('/pharmacy/medicamentos', input);
  return data;
}

export async function addStock(
  medicationId: string,
  input: { batchNumber: string; quantity: number; expiresAt?: string },
) {
  const { data } = await api.post(`/pharmacy/medicamentos/${medicationId}/stock`, input);
  return data;
}

export async function dispense(input: { prescriptionItemId: string; quantity: number }) {
  const { data } = await api.post('/pharmacy/dispensaciones', input);
  return data;
}
