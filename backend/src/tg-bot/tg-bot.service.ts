import { Injectable } from '@nestjs/common';
import { Update as UpdateNamespace } from '@telegraf/types/update';
import { Ctx, On, Start, Update } from 'nestjs-telegraf';
import { TelegramService } from 'src/telegram/telegram.service';
import { Context } from 'telegraf';

@Update()
@Injectable()
export class TgBotService {
  constructor(private telergamService: TelegramService) {}
  @Start()
  async start(@Ctx() ctx: Context) {
    await ctx.reply('Welcome');
  }

  @On('my_chat_member')
  async saveChat(@Ctx() ctx: Context<UpdateNamespace.MyChatMemberUpdate>) {
    const { type } = ctx.chat;

    if (type !== 'group' && type !== 'supergroup') return;

    const { id, title } = ctx.chat;
    const { status } = ctx.update.my_chat_member.new_chat_member;
    this.telergamService.updateChatData({ id, type, title, status });
  }
}
