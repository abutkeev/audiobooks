import { BadRequestException, ForbiddenException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { TelegramAccount } from './schemas/telegram-account.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TelegramAuthDataDto } from './dto/telegram-auth-data.dto';
import { createHash, createHmac } from 'crypto';
import { TELEGRAM_BOT_TOKEN } from 'src/constants';
import { TelegramAccountDto } from './dto/telegram-account.dto';

@Injectable()
export class TgService {
  constructor(@InjectModel(TelegramAccount.name) private telegramAccountModel: Model<TelegramAccount>) {}

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
    return true;
  }

  async remove(userId: string): Promise<true> {
    await this.telegramAccountModel.deleteOne({ userId });
    return true;
  }
}
