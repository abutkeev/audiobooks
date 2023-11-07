import { Module } from '@nestjs/common';
import { TgService } from './tg.service';
import { TgController } from './tg.controller';
import { TelegramAccount, TelegramAccountsSchema } from './schemas/telegram-account.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: TelegramAccount.name, schema: TelegramAccountsSchema }])],
  providers: [TgService],
  controllers: [TgController],
})
export class TgModule {}
