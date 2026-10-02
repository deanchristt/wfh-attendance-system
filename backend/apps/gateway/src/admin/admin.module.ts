import { Module } from '@nestjs/common';
import { AdminEmployeeController } from './admin-employee.controller';
import { AdminAttendanceController } from './admin-attendance.controller';

@Module({
  controllers: [AdminEmployeeController, AdminAttendanceController],
})
export class AdminModule {}
