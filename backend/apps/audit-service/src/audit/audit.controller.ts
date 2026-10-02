import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EmployeeProfileUpdatedEvent, EVENT_PATTERNS } from '@app/common';
import { AuditService } from './audit.service';

@Controller()
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @EventPattern(EVENT_PATTERNS.EMPLOYEE_PROFILE_UPDATED)
  handleProfileUpdated(@Payload() event: EmployeeProfileUpdatedEvent) {
    return this.auditService.recordProfileUpdated(event);
  }
}
