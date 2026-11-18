import { api } from './api';

export interface AuditLogEntry {
  id: string;
  actorUserId?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  createdAt: string;
}

export async function listAuditLogs(filters: { entityType?: string; entityId?: string }): Promise<AuditLogEntry[]> {
  const { data } = await api.get('/audit-logs', { params: filters });
  return data;
}
