import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  ChangePasswordDto,
  CreateEmployeeDto,
  IDENTITY_PATTERNS,
  UpdateEmployeeDto,
  UpdateProfileDto,
} from '@app/common';
import { EmployeeService } from './employee.service';

@Controller()
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @MessagePattern(IDENTITY_PATTERNS.GET_PROFILE)
  getProfile(@Payload() data: { employeeId: string }) {
    return this.employeeService.getProfile(data.employeeId);
  }

  @MessagePattern(IDENTITY_PATTERNS.UPDATE_PROFILE)
  updateProfile(@Payload() data: { employeeId: string; dto: UpdateProfileDto }) {
    return this.employeeService.updateProfile(data.employeeId, data.dto);
  }

  @MessagePattern(IDENTITY_PATTERNS.CHANGE_PASSWORD)
  changePassword(@Payload() data: { employeeId: string; dto: ChangePasswordDto }) {
    return this.employeeService.changePassword(data.employeeId, data.dto);
  }

  @MessagePattern(IDENTITY_PATTERNS.LIST_EMPLOYEES)
  listEmployees() {
    return this.employeeService.listEmployees();
  }

  @MessagePattern(IDENTITY_PATTERNS.GET_EMPLOYEE)
  getEmployee(@Payload() data: { employeeId: string }) {
    return this.employeeService.getEmployee(data.employeeId);
  }

  @MessagePattern(IDENTITY_PATTERNS.CREATE_EMPLOYEE)
  createEmployee(@Payload() dto: CreateEmployeeDto) {
    return this.employeeService.createEmployee(dto);
  }

  @MessagePattern(IDENTITY_PATTERNS.UPDATE_EMPLOYEE)
  updateEmployee(@Payload() data: { employeeId: string; dto: UpdateEmployeeDto }) {
    return this.employeeService.updateEmployee(data.employeeId, data.dto);
  }
}
