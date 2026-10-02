import { IsEmail, IsISO8601, IsObject, IsString, IsUUID } from 'class-validator';

export class EmployeeProfileUpdatedEvent {
  @IsUUID()
  employeeId: string;

  @IsString()
  fullName: string;

  @IsEmail()
  companyEmail: string;

  /** Field name -> { old, new } for every field that actually changed. */
  @IsObject()
  changes: Record<string, { old: unknown; new: unknown }>;

  @IsISO8601()
  changedAt: string;
}
