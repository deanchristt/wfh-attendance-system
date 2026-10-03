import { apiClient } from './client';
import type { AttendanceRecord } from '../types';

export interface AttendanceFilter {
  employeeId?: string;
  from?: string;
  to?: string;
}

export async function listAllAttendance(filter: AttendanceFilter): Promise<AttendanceRecord[]> {
  const { data } = await apiClient.get('/admin/attendance', { params: filter });
  return data;
}
