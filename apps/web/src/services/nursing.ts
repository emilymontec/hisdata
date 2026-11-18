import { api } from './api';

export interface NursingNote {
  id: string;
  observation: string;
  vitalSigns?: Record<string, unknown>;
  createdAt: string;
}

export async function listNotesByAdmission(admissionId: string): Promise<NursingNote[]> {
  const { data } = await api.get(`/nursing-notes/admision/${admissionId}`);
  return data;
}

export async function createNursingNote(input: {
  admissionId?: string;
  observation: string;
  vitalSigns?: Record<string, unknown>;
}): Promise<NursingNote> {
  const { data } = await api.post('/nursing-notes', input);
  return data;
}
