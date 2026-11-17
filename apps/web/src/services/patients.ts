import { api } from './api';

export interface Patient {
  id: string;
  documentType: string;
  documentNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  sex: string;
  phone?: string;
  email?: string;
  address?: string;
  duplicateOfId?: string | null;
}

export interface CreatePatientInput {
  documentType: string;
  documentNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  sex: string;
  phone?: string;
  email?: string;
  address?: string;
}

export async function searchPatients(query: string): Promise<Patient[]> {
  const { data } = await api.get('/patients', { params: { q: query } });
  return data;
}

export async function getPatient(id: string): Promise<Patient> {
  const { data } = await api.get(`/patients/${id}`);
  return data;
}

export async function createPatient(input: CreatePatientInput): Promise<Patient> {
  const { data } = await api.post('/patients', input);
  return data;
}
