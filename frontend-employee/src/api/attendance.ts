import { apiClient } from './client';
import type { AttendanceStatus, AttendanceSummaryRow } from '../types';

export async function recordAttendance(status: AttendanceStatus) {
  const { data } = await apiClient.post('/attendance', { status });
  return data;
}

export async function getAttendanceSummary(from?: string, to?: string): Promise<AttendanceSummaryRow[]> {
  const { data } = await apiClient.get('/attendance/summary', { params: { from, to } });
  return data;
}
