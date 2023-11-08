import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
  forwardRef,
} from '@nestjs/common';
import { TelegramAccount } from './schemas/telegram-account.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TelegramAuthDataDto } from './dto/telegram-auth-data.dto';
import { createHash, createHmac } from 'crypto';
import { TELEGRAM_BOT_TOKEN } from 'src/constants';
import { TelegramAccountDto } from './dto/telegram-account.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from '../auth.service';
import { LoginResponseDto } from '../dto/login-response.dto';
import { TelegramService } from 'src/telegram/telegram.service';

@Injectable()
export class TgService {
  constructor(
    @InjectModel(TelegramAccount.name) private telegramAccountModel: Model<TelegramAccount>,

    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,

    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,

    @Inject(forwardRef(() => TelegramService))
    private telegramService: TelegramService
  ) {}

  private verifyAuthData({ hash, ...data }: TelegramAuthDataDto): boolean {
    if (!TELEGRAM_BOT_TOKEN) {
      throw new ServiceUnavailableException('token not configured');
    }

    if (!hash) {
      throw new BadRequestException('hash  is not set');
    }

    const secret = createHash('sha256').update(TELEGRAM_BOT_TOKEN).digest();
    const dataCheckString = Object.entries(data)
      .sort()
      .map(([name, value]) => `${name}=${value}`)
      .join('\n');
    const computedHash = createHmac('sha256', secret).update(dataCheckString).digest('hex');

    return hash === computedHash;
  }

  async get(userId: string): Promise<TelegramAccountDto> {
    const info = await this.telegramAccountModel.findOne({ userId });
    return { info };
  }

  async set(userId: string, data: TelegramAuthDataDto): Promise<true> {
    if (!this.verifyAuthData(data)) {
      throw new ForbiddenException('hash check failed');
    }
    const { id, first_name, last_name, username, photo_url } = data;
    await this.telegramAccountModel.deleteOne({ userId });
    await this.telegramAccountModel.deleteOne({ id });
    await this.telegramAccountModel.create({ id, userId, first_name, last_name, username, photo_url });
    const user = await this.usersService.find(userId);
    if (user && !user.enabled && (await this.telegramService.isAuthorizedChatMember(data.id))) {
      await this.usersService.update(userId, { enabled: true });
    }

    return true;
  }

  async remove(userId: string): Promise<true> {
    await this.telegramAccountModel.deleteOne({ userId });
    return true;
  }

  async auth(data: TelegramAuthDataDto): Promise<LoginResponseDto> {
    if (!this.verifyAuthData(data)) {
      throw new ForbiddenException('hash check failed');
    }
    const info = await this.telegramAccountModel.findOne({ id: data.id });
    if (!info) {
      throw new NotFoundException('telegram account info not found');
    }
    const user = await this.usersService.find(info.userId);
    return this.authService.login(user);
  }
}
