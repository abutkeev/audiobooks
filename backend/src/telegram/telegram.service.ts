import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chat } from './schemas/chat.schema';
import { Model } from 'mongoose';
import { ChatDto } from './dto/chat.dto';
import { Context, Telegraf } from 'telegraf';
import { InjectBot } from 'nestjs-telegraf';

@Injectable()
export class TelegramService {
  constructor(
    @InjectModel(Chat.name) private chatsModel: Model<Chat>,
    @InjectBot() private bot: Telegraf<Context>
  ) {}

  async updateChatData(data: Omit<Chat, 'authorized'>) {
    await this.chatsModel.updateOne({ id: data.id }, { $set: data }, { upsert: true });
  }

  async getChats(): Promise<ChatDto[]> {
    return this.chatsModel.find().exec();
  }

  async setChatAuthorized(id: number, authorized: boolean): Promise<true> {
    await this.chatsModel.updateOne({ id }, { $set: { authorized } });
    return true;
  }

  async removeChat(id: number): Promise<true> {
    const chat = await this.chatsModel.findOne({ id });
    if (chat && chat.status !== 'left' && chat.status !== 'kicked') {
      await this.bot.telegram.leaveChat(chat.id);
    }
    await this.chatsModel.deleteOne({ id });
    return true;
  }
}
