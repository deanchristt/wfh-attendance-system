import { IsISO8601, IsOptional, IsUUID } from 'class-validator';

export class AttendanceSummaryQueryDto {
  @IsUUID()
  employeeId: string;

  @IsOptional()
  @IsISO8601()
  from?: string;

  @IsOptional()
  @IsISO8601()
  to?: string;
}

export class AttendanceListAllQueryDto {
  @IsOptional()
  @IsUUID()
  employeeId?: string;

  @IsOptional()
  @IsISO8601()
  from?: string;

  @IsOptional()
  @IsISO8601()
  to?: string;
}
