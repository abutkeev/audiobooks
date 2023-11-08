import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatsSchema } from './schemas/chat.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Chat.name, schema: ChatsSchema }])],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule {}
