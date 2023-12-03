import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { EventsModule } from 'src/events/events.module';
import { TelegramAccount, TelegramAccountsSchema } from 'src/auth/tg/schemas/telegram-account.schema';
import { PublicKey, PublicKeySchema } from 'src/auth/webauthn/schemas/public-key.schema';
import { FriendRequests, FriendRequestSchema } from 'src/friends/schemas/friend-requests.schema';
import { Friend, FriendSchema } from 'src/friends/schemas/friends.schema';
import { Position, PositionSchema } from 'src/position/schemas/position.schema';
import { Settings, SettingsSchema } from 'src/profile/schemas/settings.schema';
import { TgModule } from 'src/auth/tg/tg.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: TelegramAccount.name, schema: TelegramAccountsSchema },
      { name: Position.name, schema: PositionSchema },
      { name: FriendRequests.name, schema: FriendRequestSchema },
      { name: Friend.name, schema: FriendSchema },
      { name: PublicKey.name, schema: PublicKeySchema },
      { name: Settings.name, schema: SettingsSchema },
    ]),
    forwardRef(() => EventsModule),
    forwardRef(() => TgModule),
  ],
  providers: [UsersService],
  exports: [UsersService, MongooseModule],
  controllers: [UsersController],
})
export class UsersModule {}
