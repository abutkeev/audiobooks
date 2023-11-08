import { Module } from '@nestjs/common';
import { TgBotService } from './tg-bot.service';
import { TelegramModule } from 'src/telegram/telegram.module';

@Module({
  imports: [TelegramModule],
  providers: [TgBotService],
})
export class TgBotModule {}
