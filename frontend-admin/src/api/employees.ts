import { apiClient } from './client';
import type { EmployeeProfile, Role } from '../types';

export async function listEmployees(): Promise<EmployeeProfile[]> {
  const { data } = await apiClient.get('/admin/employees');
  return data;
}

export interface CreateEmployeePayload {
  fullName: string;
  companyEmail: string;
  password: string;
  position: string;
  phoneNumber: string;
  role: Role;
}

export async function createEmployee(payload: CreateEmployeePayload): Promise<EmployeeProfile> {
  const { data } = await apiClient.post('/admin/employees', payload);
  return data;
}

export interface UpdateEmployeePayload {
  fullName?: string;
  companyEmail?: string;
  position?: string;
  phoneNumber?: string;
  role?: Role;
}

export async function updateEmployee(id: string, payload: UpdateEmployeePayload): Promise<EmployeeProfile> {
  const { data } = await apiClient.patch(`/admin/employees/${id}`, payload);
  return data;
}
