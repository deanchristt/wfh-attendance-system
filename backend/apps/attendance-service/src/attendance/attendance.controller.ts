import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  ATTENDANCE_PATTERNS,
  AttendanceListAllQueryDto,
  AttendanceSummaryQueryDto,
  RecordAttendanceDto,
} from '@app/common';
import { AttendanceService } from './attendance.service';

@Controller()
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @MessagePattern(ATTENDANCE_PATTERNS.RECORD)
  record(@Payload() dto: RecordAttendanceDto) {
    return this.attendanceService.record(dto);
  }

  @MessagePattern(ATTENDANCE_PATTERNS.GET_SUMMARY)
  getSummary(@Payload() query: AttendanceSummaryQueryDto) {
    return this.attendanceService.getSummary(query);
  }

  @MessagePattern(ATTENDANCE_PATTERNS.LIST_ALL)
  listAll(@Payload() query: AttendanceListAllQueryDto) {
    return this.attendanceService.listAll(query);
  }
}
