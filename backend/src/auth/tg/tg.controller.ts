import { Body, Controller, Delete, Get, Post, Put, Request } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AllowInactive } from '../allow-inactive.decorator';
import { TgService } from './tg.service';
import { TelegramAuthDataDto } from './dto/telegram-auth-data.dto';
import { Public } from '../public.decorator';
import { LoginResponseDto } from '../dto/login-response.dto';

@AllowInactive()
@ApiTags('tg')
@Controller('auth/tg')
export class TgController {
  constructor(private tgService: TgService) {}

  @Get()
  @ApiOperation({ description: 'Get telegram account data' })
  getAccountInfo(@Request() { user }) {
    return this.tgService.get(user.id);
  }

  @Put()
  @ApiOperation({ description: 'Set telegram account data' })
  setAuthData(@Body() data: TelegramAuthDataDto, @Request() { user }) {
    return this.tgService.set(user.id, data);
  }

  @Delete()
  @ApiOperation({ description: 'Set telegram account data' })
  removeAuthData(@Request() { user }) {
    return this.tgService.remove(user.id);
  }

  @Public()
  @Post('login')
  @ApiOperation({ description: 'Authorize user by telegram' })
  async login(@Body() data: TelegramAuthDataDto): Promise<LoginResponseDto> {
    return await this.tgService.auth(data);
  }
}
