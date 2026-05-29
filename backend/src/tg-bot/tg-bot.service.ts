import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Update as UpdateNamespace } from '@telegraf/types/update';
import { InjectBot, Ctx, On, Start, Update } from 'nestjs-telegraf';
import { TelegramService } from 'src/telegram/telegram.service';
import { Context, Telegraf } from 'telegraf';

@Update()
@Injectable()
export class TgBotService implements OnModuleInit {
  private readonly logger = new Logger(TgBotService.name);

  constructor(
    @InjectBot() private bot: Telegraf<Context>,
    private telergamService: TelegramService
  ) {}

  async onModuleInit() {
    this.launchBot();
  }

  private async launchBot() {
    try {
      await this.bot.launch();
      this.logger.log('Telegram bot started');
    } catch (e) {
      this.logger.warn(`Telegram bot failed to start: ${e.message}, retrying in 30s`);
      setTimeout(() => this.launchBot(), 30000);
    }
  }
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
