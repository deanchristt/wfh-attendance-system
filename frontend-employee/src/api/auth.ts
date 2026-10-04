import { apiClient } from './client';
import type { AuthUser } from '../types';

export async function login(companyEmail: string, password: string): Promise<AuthUser> {
  const { data } = await apiClient.post('/auth/login', { companyEmail, password });
  return data;
}
