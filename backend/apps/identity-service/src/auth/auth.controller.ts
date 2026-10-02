import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IDENTITY_PATTERNS, LoginRequestDto } from '@app/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(IDENTITY_PATTERNS.LOGIN)
  login(@Payload() dto: LoginRequestDto) {
    return this.authService.login(dto);
  }
}
