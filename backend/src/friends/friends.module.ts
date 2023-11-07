import { forwardRef, Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FriendRequests, FriendRequestSchema } from './schemas/friend-requests.schema';
import { UsersModule } from 'src/users/users.module';
import { Friend, FriendSchema } from './schemas/friends.schema';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FriendRequests.name, schema: FriendRequestSchema },
      { name: Friend.name, schema: FriendSchema },
    ]),
    forwardRef(() => UsersModule),
    forwardRef(() => EventsModule),
  ],
  providers: [FriendsService],
  exports: [FriendsService],
  controllers: [FriendsController],
})
export class FriendsModule {}
