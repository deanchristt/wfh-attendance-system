import {
  Body,
  Controller,
  Get,
  Inject,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';
import {
  callRpc,
  ChangePasswordDto,
  IDENTITY_PATTERNS,
  JwtPayload,
  MQ_CLIENTS,
  UpdateProfileDto,
} from '@app/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@ApiTags('profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(@Inject(MQ_CLIENTS.IDENTITY) private readonly identityClient: ClientProxy) {}

  @Get('me')
  getProfile(@CurrentUser() user: JwtPayload) {
    return callRpc(this.identityClient.send(IDENTITY_PATTERNS.GET_PROFILE, { employeeId: user.sub }));
  }

  @Patch('me')
  updateProfile(@CurrentUser() user: JwtPayload, @Body() dto: UpdateProfileDto) {
    return callRpc(
      this.identityClient.send(IDENTITY_PATTERNS.UPDATE_PROFILE, { employeeId: user.sub, dto }),
    );
  }

  @Post('me/password')
  changePassword(@CurrentUser() user: JwtPayload, @Body() dto: ChangePasswordDto) {
    return callRpc(
      this.identityClient.send(IDENTITY_PATTERNS.CHANGE_PASSWORD, { employeeId: user.sub, dto }),
    );
  }

  @Post('me/photo')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/photos',
        filename: (_req, file, cb) => cb(null, `${uuid()}${extname(file.originalname)}`),
      }),
      limits: { fileSize: 2 * 1024 * 1024 },
    }),
  )
  async uploadPhoto(@CurrentUser() user: JwtPayload, @UploadedFile() file: Express.Multer.File) {
    const photoUrl = `/uploads/photos/${file.filename}`;
    return callRpc(
      this.identityClient.send(IDENTITY_PATTERNS.UPDATE_PROFILE, {
        employeeId: user.sub,
        dto: { photoUrl } as UpdateProfileDto,
      }),
    );
  }
}
