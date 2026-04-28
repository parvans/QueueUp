// src/types/index.ts

export type QueueStatus = 'open' | 'busy' | 'closed' | 'paused';

export type TicketStatus = 'waiting' | 'called' | 'served' | 'cancelled';

export type Queue = {
  id: string;
  name: string;
  organization: string;
  status: QueueStatus;
  waitMinutes: number;
  peopleAhead: number;
  totalServedToday: number;
  operatingHours: string;
};

export type Ticket = {
  id: string;
  token: string;          // e.g. "A-047"
  queueId: string;
  queueName: string;
  status: TicketStatus;
  position: number;
  nowServing: string;     // e.g. "A-044"
  estimatedWaitMinutes: number;
  joinedAt: string;       // ISO date string
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
};