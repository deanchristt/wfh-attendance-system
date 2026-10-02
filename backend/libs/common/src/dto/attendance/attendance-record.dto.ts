import { AttendanceStatus } from '../../enums/attendance-status.enum';

export class AttendanceRecordDto {
  id: string;
  employeeId: string;
  date: string;
  time: string;
  status: AttendanceStatus;
}
