import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chat } from './schemas/chat.schema';
import { Model } from 'mongoose';
import { ChatDto } from './dto/chat.dto';
import { Context, Telegraf } from 'telegraf';
import { InjectBot } from 'nestjs-telegraf';
import { EventsService } from 'src/events/events.service';

@Injectable()
export class TelegramService {
  constructor(
    @InjectModel(Chat.name) private chatsModel: Model<Chat>,
    @InjectBot() private bot: Telegraf<Context>,
    private eventsService: EventsService
  ) {}

  private static removedChats = [];

  async updateChatData(data: Omit<Chat, 'authorized'>) {
    const { id, status } = data;
    // ignore first leave event from recently deleted chat
    if (status === 'left' && TelegramService.removedChats.includes(id)) {
      TelegramService.removedChats = TelegramService.removedChats.filter(item => item !== id);
      return;
    }
    await this.chatsModel.updateOne({ id: data.id }, { $set: data }, { upsert: true });
    this.eventsService.sendToAdmins({ message: 'invalidate_tag', args: 'telergam' });
  }

  async getChats(): Promise<ChatDto[]> {
    return this.chatsModel.find().exec();
  }

  async setChatAuthorized(id: number, authorized: boolean): Promise<true> {
    await this.chatsModel.updateOne({ id }, { $set: { authorized } });
    this.eventsService.sendToAdmins({ message: 'invalidate_tag', args: 'telergam' });
    return true;
  }

  async removeChat(id: number): Promise<true> {
    const chat = await this.chatsModel.findOne({ id });
    if (chat && chat.status !== 'left' && chat.status !== 'kicked') {
      await this.bot.telegram.leaveChat(chat.id);
    }
    await this.chatsModel.deleteOne({ id });
    TelegramService.removedChats.push(id);
    this.eventsService.sendToAdmins({ message: 'invalidate_tag', args: 'telergam' });
    return true;
  }

  async isAuthorizedChatMember(telegramUid: number) {
    for (const { id } of await this.chatsModel.find({ authorized: true })) {
      try {
        const { status } = await this.bot.telegram.getChatMember(id, telegramUid);
        if (status === 'left' || status === 'kicked') {
          continue;
        }
        return true;
      } catch {}
    }
    return false;
  }
}
