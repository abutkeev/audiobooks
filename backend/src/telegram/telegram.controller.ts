import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Admin } from 'src/auth/admin.decorator';
import { TelegramService } from './telegram.service';

@Admin()
@ApiTags('telergam')
@Controller('telegram')
export class TelegramController {
  constructor(private telegramService: TelegramService) {}

  @Get('chats')
  async getChats() {
    return this.telegramService.getChats();
  }
}
