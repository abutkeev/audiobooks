import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chat } from './schemas/chat.schema';
import { Model } from 'mongoose';
import { ChatDto } from './dto/chat.dto';

@Injectable()
export class TelegramService {
  constructor(@InjectModel(Chat.name) private chatsModel: Model<Chat>) {}

  async updateChatData(data: Omit<Chat, 'authorized'>) {
    await this.chatsModel.updateOne({ id: data.id }, { $set: data }, { upsert: true });
  }

  async getChats(): Promise<ChatDto[]> {
    return this.chatsModel.find().exec();
  }
}
