import { Body, Controller, Get, Inject, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import {
  callRpc,
  CreateEmployeeDto,
  IDENTITY_PATTERNS,
  MQ_CLIENTS,
  Role,
  UpdateEmployeeDto,
} from '@app/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('admin-employees')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin/employees')
export class AdminEmployeeController {
  constructor(@Inject(MQ_CLIENTS.IDENTITY) private readonly identityClient: ClientProxy) {}

  @Get()
  list() {
    return callRpc(this.identityClient.send(IDENTITY_PATTERNS.LIST_EMPLOYEES, {}));
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return callRpc(this.identityClient.send(IDENTITY_PATTERNS.GET_EMPLOYEE, { employeeId: id }));
  }

  @Post()
  create(@Body() dto: CreateEmployeeDto) {
    return callRpc(this.identityClient.send(IDENTITY_PATTERNS.CREATE_EMPLOYEE, dto));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEmployeeDto) {
    return callRpc(
      this.identityClient.send(IDENTITY_PATTERNS.UPDATE_EMPLOYEE, { employeeId: id, dto }),
    );
  }
}
