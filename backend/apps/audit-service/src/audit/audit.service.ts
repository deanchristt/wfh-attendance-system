import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeeProfileUpdatedEvent } from '@app/common';
import { AuditLog } from '../entities/audit-log.entity';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(@InjectRepository(AuditLog) private readonly auditLogRepo: Repository<AuditLog>) {}

  async recordProfileUpdated(event: EmployeeProfileUpdatedEvent): Promise<void> {
    const entry = this.auditLogRepo.create({
      employeeId: event.employeeId,
      fullName: event.fullName,
      companyEmail: event.companyEmail,
      changes: event.changes,
    });
    await this.auditLogRepo.save(entry);
    this.logger.log(`Logged profile update for employee ${event.employeeId} into dexa_audit`);
  }
}
