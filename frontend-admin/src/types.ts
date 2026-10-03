export type Role = 'EMPLOYEE' | 'ADMIN';

export interface AuthUser {
  employeeId: string;
  fullName: string;
  companyEmail: string;
  role: Role;
  accessToken: string;
}

export interface EmployeeProfile {
  id: string;
  fullName: string;
  companyEmail: string;
  photoUrl: string | null;
  position: string;
  phoneNumber: string;
  role: Role;
}

export type AttendanceStatus = 'MASUK' | 'PULANG';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  companyEmail: string;
  date: string;
  time: string;
  status: AttendanceStatus;
}

export interface ProfileUpdatedNotification {
  employeeId: string;
  fullName: string;
  companyEmail: string;
  changes: Record<string, { old: unknown; new: unknown }>;
  changedAt: string;
}
