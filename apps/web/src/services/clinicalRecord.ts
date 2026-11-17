import { api } from './api';

export interface ClinicalNote {
  id: string;
  content: string;
  createdAt: string;
}

export interface Diagnosis {
  id: string;
  description: string;
  code?: string;
  codeSystem?: string;
  createdAt: string;
}

export interface ClinicalRecordView {
  id: string;
  patientId: string;
  notes: ClinicalNote[];
  diagnoses: Diagnosis[];
}

export async function viewClinicalRecord(patientId: string): Promise<ClinicalRecordView> {
  const { data } = await api.get(`/clinical-records/paciente/${patientId}`);
  return data;
}

export async function addClinicalNote(patientId: string, content: string) {
  const { data } = await api.post(`/clinical-records/paciente/${patientId}/notas`, { content });
  return data;
}

export async function addDiagnosis(
  patientId: string,
  payload: { description: string; code?: string; codeSystem?: string },
) {
  const { data } = await api.post(`/clinical-records/paciente/${patientId}/diagnosticos`, payload);
  return data;
}
