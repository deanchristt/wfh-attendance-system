import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
  ChangePasswordDto,
  CreateEmployeeDto,
  EmployeeProfileDto,
  EVENT_PATTERNS,
  MQ_CLIENTS,
  throwRpc,
  UpdateEmployeeDto,
  UpdateProfileDto,
} from '@app/common';
import { Employee } from '../entities/employee.entity';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee) private readonly employeeRepo: Repository<Employee>,
    @Inject(MQ_CLIENTS.AUDIT) private readonly auditClient: ClientProxy,
    @Inject(MQ_CLIENTS.NOTIFY) private readonly notifyClient: ClientProxy,
  ) {}

  private toDto(employee: Employee): EmployeeProfileDto {
    const { passwordHash: _passwordHash, ...rest } = employee;
    return rest as EmployeeProfileDto;
  }

  private async findOrThrow(employeeId: string): Promise<Employee> {
    const employee = await this.employeeRepo.findOne({ where: { id: employeeId } });
    if (!employee) {
      throwRpc(404, 'Karyawan tidak ditemukan');
    }
    return employee;
  }

  private publishProfileUpdated(employee: Employee, changes: Record<string, { old: unknown; new: unknown }>) {
    if (Object.keys(changes).length === 0) {
      return;
    }
    const event = {
      employeeId: employee.id,
      fullName: employee.fullName,
      companyEmail: employee.companyEmail,
      changes,
      changedAt: new Date().toISOString(),
    };
    this.auditClient.emit(EVENT_PATTERNS.EMPLOYEE_PROFILE_UPDATED, event);
    this.notifyClient.emit(EVENT_PATTERNS.EMPLOYEE_PROFILE_UPDATED, event);
  }

  async getProfile(employeeId: string): Promise<EmployeeProfileDto> {
    const employee = await this.findOrThrow(employeeId);
    return this.toDto(employee);
  }

  async updateProfile(employeeId: string, dto: UpdateProfileDto): Promise<EmployeeProfileDto> {
    const employee = await this.findOrThrow(employeeId);
    const changes: Record<string, { old: unknown; new: unknown }> = {};

    if (dto.phoneNumber !== undefined && dto.phoneNumber !== employee.phoneNumber) {
      changes.phoneNumber = { old: employee.phoneNumber, new: dto.phoneNumber };
      employee.phoneNumber = dto.phoneNumber;
    }
    if (dto.photoUrl !== undefined && dto.photoUrl !== employee.photoUrl) {
      changes.photoUrl = { old: employee.photoUrl, new: dto.photoUrl };
      employee.photoUrl = dto.photoUrl;
    }

    const saved = await this.employeeRepo.save(employee);
    this.publishProfileUpdated(saved, changes);
    return this.toDto(saved);
  }

  async changePassword(employeeId: string, dto: ChangePasswordDto): Promise<EmployeeProfileDto> {
    const employee = await this.findOrThrow(employeeId);
    const matches = await bcrypt.compare(dto.currentPassword, employee.passwordHash);
    if (!matches) {
      throwRpc(400, 'Password saat ini tidak sesuai');
    }
    employee.passwordHash = await bcrypt.hash(dto.newPassword, 10);
    const saved = await this.employeeRepo.save(employee);
    this.publishProfileUpdated(saved, {
      password: { old: '********', new: '********' },
    });
    return this.toDto(saved);
  }

  async listEmployees(): Promise<EmployeeProfileDto[]> {
    const employees = await this.employeeRepo.find({ order: { fullName: 'ASC' } });
    return employees.map((e) => this.toDto(e));
  }

  async getEmployee(employeeId: string): Promise<EmployeeProfileDto> {
    const employee = await this.findOrThrow(employeeId);
    return this.toDto(employee);
  }

  async createEmployee(dto: CreateEmployeeDto): Promise<EmployeeProfileDto> {
    const existing = await this.employeeRepo.findOne({ where: { companyEmail: dto.companyEmail } });
    if (existing) {
      throwRpc(409, 'Email perusahaan sudah terdaftar');
    }
    const employee = this.employeeRepo.create({
      fullName: dto.fullName,
      companyEmail: dto.companyEmail,
      passwordHash: await bcrypt.hash(dto.password, 10),
      position: dto.position,
      phoneNumber: dto.phoneNumber,
      role: dto.role,
      photoUrl: null,
    });
    const saved = await this.employeeRepo.save(employee);
    return this.toDto(saved);
  }

  async updateEmployee(employeeId: string, dto: UpdateEmployeeDto): Promise<EmployeeProfileDto> {
    const employee = await this.findOrThrow(employeeId);
    Object.assign(employee, {
      fullName: dto.fullName ?? employee.fullName,
      companyEmail: dto.companyEmail ?? employee.companyEmail,
      position: dto.position ?? employee.position,
      phoneNumber: dto.phoneNumber ?? employee.phoneNumber,
      photoUrl: dto.photoUrl ?? employee.photoUrl,
      role: dto.role ?? employee.role,
    });
    const saved = await this.employeeRepo.save(employee);
    return this.toDto(saved);
  }
}
