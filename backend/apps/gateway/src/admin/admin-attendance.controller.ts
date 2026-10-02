import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import {
  ATTENDANCE_PATTERNS,
  AttendanceRecordDto,
  callRpc,
  EmployeeProfileDto,
  IDENTITY_PATTERNS,
  MQ_CLIENTS,
  Role,
} from '@app/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('admin-attendance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin/attendance')
export class AdminAttendanceController {
  constructor(
    @Inject(MQ_CLIENTS.ATTENDANCE) private readonly attendanceClient: ClientProxy,
    @Inject(MQ_CLIENTS.IDENTITY) private readonly identityClient: ClientProxy,
  ) {}

  @Get()
  async listAll(
    @Query('employeeId') employeeId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const [records, employees] = await Promise.all([
      callRpc<AttendanceRecordDto[]>(
        this.attendanceClient.send(ATTENDANCE_PATTERNS.LIST_ALL, { employeeId, from, to }),
      ),
      callRpc<EmployeeProfileDto[]>(this.identityClient.send(IDENTITY_PATTERNS.LIST_EMPLOYEES, {})),
    ]);

    const employeeById = new Map(employees.map((e) => [e.id, e]));
    return records.map((record) => {
      const employee = employeeById.get(record.employeeId);
      return {
        ...record,
        employeeName: employee?.fullName ?? 'Unknown',
        companyEmail: employee?.companyEmail ?? '-',
      };
    });
  }
}
