// src/api/auth.api.ts
import { apiClient } from './client';

export async function registerAPI(data: {
  name: string; email: string; password: string; phone?: string;
}) {
  const res = await apiClient.post('/auth/register', data);
  return res.data;
}

export async function loginAPI(email: string, password: string) {
  const res = await apiClient.post('/auth/login', { email, password });
  return res.data;
}