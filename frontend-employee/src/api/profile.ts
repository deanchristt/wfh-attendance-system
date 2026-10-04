import { apiClient } from './client';
import type { EmployeeProfile } from '../types';

export async function getMyProfile(): Promise<EmployeeProfile> {
  const { data } = await apiClient.get('/profile/me');
  return data;
}

export async function updateMyProfile(payload: { phoneNumber?: string }): Promise<EmployeeProfile> {
  const { data } = await apiClient.patch('/profile/me', payload);
  return data;
}

export async function uploadMyPhoto(file: File): Promise<EmployeeProfile> {
  const form = new FormData();
  form.append('photo', file);
  const { data } = await apiClient.post('/profile/me/photo', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function changeMyPassword(currentPassword: string, newPassword: string): Promise<void> {
  await apiClient.post('/profile/me/password', { currentPassword, newPassword });
}
