import { api } from './api';

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
}

export async function listInventoryItems(): Promise<InventoryItem[]> {
  const { data } = await api.get('/inventory/items');
  return data;
}

export async function createInventoryItem(input: { name: string; category: string }): Promise<InventoryItem> {
  const { data } = await api.post('/inventory/items', input);
  return data;
}

export async function registerMovement(
  itemId: string,
  input: { type: 'IN' | 'OUT' | 'ADJUSTMENT'; quantity: number },
) {
  const { data } = await api.post(`/inventory/items/${itemId}/movimientos`, input);
  return data;
}
