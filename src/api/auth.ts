import { User } from "@/types";
import { apiClient } from "./client";

type RegisterPayload = {
    name:string;
    email:string;
    phone?:string;
    password:string;
}

type AuthResponse = {
    token:string;
    user:User;
}

export async function registerAPI(data: RegisterPayload) {
  const res = await apiClient.post('/auth/register', data);
  return res.data;
}

export async function loginAPI(email: string, password: string) {
  const res = await apiClient.post('/auth/login', { email, password });
  return res.data;
}