/**
 * Axios client — single instance for the whole app
 * Automatically attaches JWT token from storage on every request
 */
import axios from 'axios';
import { Config } from '../constants';
import { storage } from '../utils';

const apiClient = axios.create({
  baseURL: Config.API_BASE_URL,
  timeout: Config.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request interceptor: attach token ───────────────────────────────────────
apiClient.interceptors.request.use(async (config) => {
  const token = await storage.get<string>(Config.TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response interceptor: normalize errors ──────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.response?.data ||
      error?.message ||
      'Something went wrong';
    return Promise.reject(new Error(String(message)));
  }
);

export default apiClient;
