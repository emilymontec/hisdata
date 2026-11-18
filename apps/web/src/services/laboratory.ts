import { api } from './api';

export interface LabResult {
  id: string;
  parameter: string;
  value: string;
  unit?: string;
  referenceRange?: string;
  validatedAt?: string;
}

export interface LabRequest {
  id: string;
  status: string;
  sampleCollectedAt?: string;
  results: LabResult[];
}

export async function getLabRequest(id: string): Promise<LabRequest> {
  const { data } = await api.get(`/lab-requests/${id}`);
  return data;
}

export async function registerSampleCollected(id: string): Promise<LabRequest> {
  const { data } = await api.patch(`/lab-requests/${id}/muestra-tomada`);
  return data;
}

export async function registerResult(
  id: string,
  input: { parameter: string; value: string; unit?: string; referenceRange?: string },
): Promise<LabResult> {
  const { data } = await api.patch(`/lab-requests/${id}/resultado`, input);
  return data;
}

export async function validateAndPublish(id: string): Promise<LabRequest> {
  const { data } = await api.patch(`/lab-requests/${id}/validar-publicar`);
  return data;
}
