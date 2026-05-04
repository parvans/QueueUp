// src/api/queue.api.ts
import { apiClient } from './client';

export async function getQueuesAPI() {
  const res = await apiClient.get('/queues');
  return res.data;
}

export async function getQueueAPI(id: string) {
  const res = await apiClient.get(`/queues/${id}`);
  return res.data;
}