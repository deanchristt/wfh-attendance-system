import { Role } from '@app/common';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'employees' })
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Index({ unique: true })
  @Column({ name: 'company_email' })
  companyEmail: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ name: 'photo_url', nullable: true, type: 'varchar' })
  photoUrl: string | null;

  @Column()
  position: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column({ type: 'enum', enum: Role, default: Role.EMPLOYEE })
  role: Role;

  @CreateDateColumn({ name: 'gmt_create' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'gmt_modified' })
  updatedAt: Date;
}
