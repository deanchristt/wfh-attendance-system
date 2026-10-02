import { Body, Controller, Get, Inject, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import {
  ATTENDANCE_PATTERNS,
  AttendanceStatus,
  callRpc,
  JwtPayload,
  MQ_CLIENTS,
} from '@app/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@ApiTags('attendance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(@Inject(MQ_CLIENTS.ATTENDANCE) private readonly attendanceClient: ClientProxy) {}

  @Post()
  record(@CurrentUser() user: JwtPayload, @Body('status') status: AttendanceStatus) {
    return callRpc(
      this.attendanceClient.send(ATTENDANCE_PATTERNS.RECORD, { employeeId: user.sub, status }),
    );
  }

  @Get('summary')
  getSummary(@CurrentUser() user: JwtPayload, @Query('from') from?: string, @Query('to') to?: string) {
    return callRpc(
      this.attendanceClient.send(ATTENDANCE_PATTERNS.GET_SUMMARY, { employeeId: user.sub, from, to }),
    );
  }
}
