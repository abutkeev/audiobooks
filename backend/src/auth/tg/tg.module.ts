import { Module, forwardRef } from '@nestjs/common';
import { TgService } from './tg.service';
import { TgController } from './tg.controller';
import { TelegramAccount, TelegramAccountsSchema } from './schemas/telegram-account.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth.module';
import { UsersModule } from 'src/users/users.module';
import { TelegramModule } from 'src/telegram/telegram.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TelegramAccount.name, schema: TelegramAccountsSchema }]),
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
    forwardRef(() => TelegramModule),
  ],
  providers: [TgService],
  controllers: [TgController],
  exports: [TgService],
})
export class TgModule {}
