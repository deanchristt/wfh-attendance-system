import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'employee_profile_audit_logs' })
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'employee_id' })
  employeeId: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ name: 'company_email' })
  companyEmail: string;

  @Column({ type: 'jsonb' })
  changes: Record<string, { old: unknown; new: unknown }>;

  @CreateDateColumn({ name: 'gmt_create' })
  createdAt: Date;
}
