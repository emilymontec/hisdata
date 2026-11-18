import { api } from './api';

export interface Notification {
  id: string;
  title: string;
  body: string;
  channel: string;
  readAt?: string;
  createdAt: string;
}

export async function listMyNotifications(userId: string): Promise<Notification[]> {
  const { data } = await api.get(`/notifications/usuario/${userId}`);
  return data;
}

export async function markRead(id: string): Promise<Notification> {
  const { data } = await api.patch(`/notifications/${id}/leida`);
  return data;
}
