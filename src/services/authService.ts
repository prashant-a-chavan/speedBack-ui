import apiClient from '../api/apiClient';
import { AuthSession, LoginRequest } from '../types';

export const loginMember = async (credentials: LoginRequest): Promise<AuthSession> => {
  const response = await apiClient.post<AuthSession>('/auth/login', credentials);
  return response.data;
};
