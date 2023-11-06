import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FriendRequests, FriendRequestSchema } from './schemas/friend-requests.schema';
import { UsersModule } from 'src/users/users.module';
import { Friend, FriendSchema } from './schemas/friends.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FriendRequests.name, schema: FriendRequestSchema },
      { name: Friend.name, schema: FriendSchema },
    ]),
    UsersModule,
  ],
  providers: [FriendsService],
  controllers: [FriendsController],
})
export class FriendsModule {}
