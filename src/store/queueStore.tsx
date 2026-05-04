// src/store/queueStore.ts
import { create } from 'zustand';
import { getQueuesAPI, getQueueAPI } from '@/api/queue.api';
import { Queue } from '@/types';

type QueueStore = {
  queues:        Queue[];
  selectedQueue: Queue | null;
  isLoading:     boolean;
  error:         string | null;

  fetchQueues:   () => Promise<void>;
  fetchQueue:    (id: string) => Promise<void>;
};

export const useQueueStore = create<QueueStore>((set) => ({
  queues:        [],
  selectedQueue: null,
  isLoading:     false,
  error:         null,

  fetchQueues: async () => {
    set({ isLoading: true, error: null });
    try {
      const queues = await getQueuesAPI();
      set({ queues, isLoading: false });
    } catch (e: any) {
      set({ error: 'Failed to load queues', isLoading: false });
    }
  },

  fetchQueue: async (id) => {
    set({ isLoading: true });
    try {
      const queue = await getQueueAPI(id);
      set({ selectedQueue: queue, isLoading: false });
    } catch (e: any) {
      set({ error: 'Failed to load queue', isLoading: false });
    }
  },
}));