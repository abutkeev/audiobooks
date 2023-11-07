import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { FriendRequests } from './schemas/friend-requests.schema';
import { FriendRequestDto } from './dto/friend-request.dto';
import { Friend } from './schemas/friends.schema';
import { EventsService } from 'src/events/events.service';

@Injectable()
export class FriendsService {
  constructor(
    @InjectModel(FriendRequests.name) private friendsRequestsModel: Model<FriendRequests>,
    @InjectModel(Friend.name) private friendsModel: Model<Friend>,
    private eventsService: EventsService,
    private usersService: UsersService
  ) {}

  async addRequest(from: string, toLogin: string) {
    const to = await this.usersService.findIdByLogin(toLogin);

    if (!to) {
      throw new NotFoundException(`user ${toLogin} not found`);
    }

    if (to.toString() === from) {
      throw new BadRequestException(`can't add yourself`);
    }

    const request = await this.friendsRequestsModel.findOne({ from, to }).exec();
    if (request) {
      throw new ConflictException('request already exists');
    }

    if (
      await this.friendsModel.findOne({
        $or: [
          { user1: from, user2: to },
          { user1: to, user2: from },
        ],
      })
    ) {
      return true;
    }

    await this.friendsRequestsModel.create({ from, to });
    this.eventsService.sendToUser({ userId: to.toString(), message: 'invalidate_tag', args: 'friends' });
    return true;
  }

  async getRequests(uid: string, type: 'in' | 'out'): Promise<FriendRequestDto[]> {
    const requests = await this.friendsRequestsModel.find(type === 'in' ? { to: uid } : { from: uid }).exec();
    const users = await this.usersService.findAll();
    return requests.map(({ _id, from, to }) => {
      const id = _id.toString();
      const uid = type === 'in' ? from.toString() : to.toString();
      const { login, name } = users.find(({ id }) => id === uid) || {};
      return { id, uid, login, name };
    });
  }

  async approve(uid: string, request_id: string): Promise<boolean> {
    const request = await this.friendsRequestsModel.findOneAndDelete({ _id: request_id, to: uid });
    if (!request) {
      throw new NotFoundException(`request ${request_id} not found`);
    }
    const { from, to } = request;
    const friendsRecord = await this.friendsModel.findOne({
      $or: [
        { user1: from, user2: to },
        { user1: to, user2: from },
      ],
    });

    if (friendsRecord) {
      this.eventsService.sendToUser({ userId: from.toString(), message: 'invalidate_tag', args: 'friends' });
      return true;
    }
    await this.friendsModel.create({ user1: from, user2: to });
    this.eventsService.sendToUser({ userId: from.toString(), message: 'invalidate_tag', args: 'friends' });
    return true;
  }

  async removeRequest(uid: string, request_id: string, type: 'in' | 'out'): Promise<boolean> {
    const request = await this.friendsRequestsModel.findOneAndDelete(
      type === 'out' ? { _id: request_id, from: uid } : { _id: request_id, to: uid }
    );
    if (!request) {
      throw new NotFoundException(`request ${request_id} not found`);
    }
    this.eventsService.sendToUser({
      userId: type === 'in' ? request.from.toString() : request.to.toString(),
      message: 'invalidate_tag',
      args: 'friends',
    });
    return true;
  }
}
