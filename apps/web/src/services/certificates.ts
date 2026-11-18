import { api } from './api';

export interface Certificate {
  id: string;
  type: string;
  content: string;
  createdAt: string;
}

export async function listCertificatesByPatient(patientId: string): Promise<Certificate[]> {
  const { data } = await api.get(`/certificates/paciente/${patientId}`);
  return data;
}

export async function createCertificate(input: {
  patientId: string;
  type: string;
  content: string;
}): Promise<Certificate> {
  const { data } = await api.post('/certificates', input);
  return data;
}
