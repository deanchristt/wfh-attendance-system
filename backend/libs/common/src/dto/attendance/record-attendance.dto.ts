import { IsEnum, IsUUID } from 'class-validator';
import { AttendanceStatus } from '../../enums/attendance-status.enum';

export class RecordAttendanceDto {
  @IsUUID()
  employeeId: string;

  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;
}
