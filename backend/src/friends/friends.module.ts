import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FriendRequests, FriendRequestSchema } from './schemas/friend-requests.schema';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: FriendRequests.name, schema: FriendRequestSchema }]), UsersModule],
  providers: [FriendsService],
  controllers: [FriendsController],
})
export class FriendsModule {}
