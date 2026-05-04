// src/api/ticket.api.ts
import { apiClient } from './client';

export async function joinQueueAPI(queueId: string) {
  const res = await apiClient.post('/tickets/join', { queueId });
  return res.data;
}

export async function getMyTicketsAPI() {
  const res = await apiClient.get('/tickets/my');
  return res.data;
}

export async function getTicketStatusAPI(queueId: string, ticketId: string) {
  const res = await apiClient.get(`/tickets/${queueId}/${ticketId}`);
  return res.data;
}

export async function cancelTicketAPI(ticketId: string) {
  const res = await apiClient.patch(`/tickets/${ticketId}/cancel`);
  return res.data;
}