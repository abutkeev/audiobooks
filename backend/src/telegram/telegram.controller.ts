import { BadRequestException, Controller, Delete, Get, Param, Put } from '@nestjs/common';
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

  @Put('chat/:id/authorized')
  async authorizeChat(@Param('id') id: number) {
    return this.telegramService.setChatAuthorized(id, true);
  }

  @Delete('chat/:id/authorized')
  async unauthorizeChat(@Param('id') id: number) {
    return this.telegramService.setChatAuthorized(id, false);
  }
}
