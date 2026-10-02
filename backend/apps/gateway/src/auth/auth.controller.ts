import { Body, Controller, HttpCode, HttpStatus, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { callRpc, IDENTITY_PATTERNS, LoginRequestDto, MQ_CLIENTS } from '@app/common';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(@Inject(MQ_CLIENTS.IDENTITY) private readonly identityClient: ClientProxy) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginRequestDto) {
    return callRpc(this.identityClient.send(IDENTITY_PATTERNS.LOGIN, dto));
  }
}
