// src/api/client.ts
// This is the single Axios instance used across the entire app.
// Every API call goes through this — never import axios directly.

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Use your machine's local IP when testing on a real device.
// localhost won't work on physical devices — it refers to the phone itself.
// Find your IP with: ipconfig getifaddr en0  (macOS)
export const BASE_URL = 'http://YOUR_LOCAL_IP:4000/api/v1';

export const apiClient = axios.create({
    baseURL:BASE_URL,
    timeout:10000,        // fail after 10 seconds
    headers:{ 'Content-Type':'application/json' }
});

// ── Request interceptor ─────────────────────────────────────────
// Runs before EVERY request. Reads token from storage and attaches it.
// You never have to manually add the Authorization header anywhere.

apiClient.interceptors.request.use(async(config)=>{
    const token = await AsyncStorage.getItem('auth_token');
    if(token){
        config.headers.Authorization = `Bear ${token}`
    }
    return config
});

// ── Response interceptor ────────────────────────────────────────
// Runs after EVERY response. Handles 401 (token expired) globally.
// If the server returns 401, we clear the token and send user to login.

// ── Response interceptor — auto refresh on 401 ───────────────────
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const refresh = await AsyncStorage.getItem('refreshToken');
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken: refresh,
        });

        await AsyncStorage.setItem('accessToken',  data.accessToken);
        await AsyncStorage.setItem('refreshToken', data.refreshToken);

        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return apiClient(original);    // retry original request with new token
      } catch {
        // Refresh failed — clear tokens, redirect to login
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
      }
    }

    return Promise.reject(error);
  }
);