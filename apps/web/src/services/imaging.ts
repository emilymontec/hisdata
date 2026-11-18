import { api } from './api';

export interface ImagingReport {
  id: string;
  findings: string;
  documentUrl?: string;
}

export interface ImagingRequestDetail {
  id: string;
  status: string;
  modality: string;
  report?: ImagingReport;
}

export async function getImagingRequest(id: string): Promise<ImagingRequestDetail> {
  const { data } = await api.get(`/imaging-requests/${id}`);
  return data;
}

export async function markInProgress(id: string): Promise<ImagingRequestDetail> {
  const { data } = await api.patch(`/imaging-requests/${id}/en-proceso`);
  return data;
}

export async function createReport(
  id: string,
  input: { findings: string; documentUrl?: string },
): Promise<ImagingReport> {
  const { data } = await api.patch(`/imaging-requests/${id}/informe`, input);
  return data;
}
