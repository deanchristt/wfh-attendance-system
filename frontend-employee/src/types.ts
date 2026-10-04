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

export interface AttendanceSummaryRow {
  date: string;
  masukTime: string | null;
  pulangTime: string | null;
}
