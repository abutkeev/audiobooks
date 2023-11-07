import { Module, forwardRef } from '@nestjs/common';
import { TgService } from './tg.service';
import { TgController } from './tg.controller';
import { TelegramAccount, TelegramAccountsSchema } from './schemas/telegram-account.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TelegramAccount.name, schema: TelegramAccountsSchema }]),
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
  ],
  providers: [TgService],
  controllers: [TgController],
})
export class TgModule {}
