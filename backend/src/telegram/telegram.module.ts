import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatsSchema } from './schemas/chat.schema';
import { TelegramController } from './telegram.controller';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Chat.name, schema: ChatsSchema }]), EventsModule],
  providers: [TelegramService],
  exports: [TelegramService],
  controllers: [TelegramController],
})
export class TelegramModule {}
