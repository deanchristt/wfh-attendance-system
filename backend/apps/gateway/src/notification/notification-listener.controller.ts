import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EmployeeProfileUpdatedEvent, EVENT_PATTERNS } from '@app/common';
import { NotificationGateway } from './notification.gateway';

@Controller()
export class NotificationListenerController {
  constructor(private readonly notificationGateway: NotificationGateway) {}

  @EventPattern(EVENT_PATTERNS.EMPLOYEE_PROFILE_UPDATED)
  handleProfileUpdated(@Payload() event: EmployeeProfileUpdatedEvent) {
    this.notificationGateway.broadcastProfileUpdated(event);
  }
}
