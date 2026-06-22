/**
 * Auth API calls
 */
import apiClient from './client';
import { LoginResponse, User } from '../types';

export interface LoginPayload {
  phoneNumber: string;
}

export interface CreateUserPayload {
  fullName: string;
  phoneNumber: string;
  role: string;
}

export const authApi = {
  /** Login with phone number — returns JWT + user */
  login: (payload: LoginPayload) =>
    apiClient.post<LoginResponse>('/api/Users/login', payload),

  /** Create a new user (admin use) */
  createUser: (payload: CreateUserPayload) =>
    apiClient.post<{ user: User; message: string }>('/api/Users', payload),

  /** Get all users (admin only) */
  getAllUsers: () => apiClient.get<User[]>('/api/Users'),
};
