import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { FriendRequests } from './schemas/friend-requests.schema';
import { FriendDto } from './dto/friend.dto';
import { Friend } from './schemas/friends.schema';
import { EventsService } from 'src/events/events.service';

@Injectable()
export class FriendsService {
  constructor(
    @InjectModel(FriendRequests.name) private friendsRequestsModel: Model<FriendRequests>,
    @InjectModel(Friend.name) private friendsModel: Model<Friend>,

    @Inject(forwardRef(() => EventsService))
    private eventsService: EventsService,

    @Inject(forwardRef(() => UsersService))
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

  private async getFriendEntry({ id, uid }: { id: mongoose.Types.ObjectId; uid: mongoose.Schema.Types.ObjectId }) {
    const users = await this.usersService.findAll();
    const { login, name, online } = users.find(({ id }) => id === uid.toString()) || {};
    return { id: id.toString(), uid: uid.toString(), login, name, online };
  }

  async getRequests(uid: string, type: 'in' | 'out'): Promise<FriendDto[]> {
    const requests = await this.friendsRequestsModel.find(type === 'in' ? { to: uid } : { from: uid }).exec();
    return Promise.all(
      requests.map(({ _id, from, to }) => this.getFriendEntry({ id: _id, uid: type === 'in' ? from : to }))
    );
  }

  async get(uid: string): Promise<FriendDto[]> {
    const friends = await this.friendsModel.find({ $or: [{ user1: uid }, { user2: uid }] }).exec();
    return Promise.all(
      friends.map(({ _id, user1, user2 }) =>
        this.getFriendEntry({ id: _id, uid: user1.toString() === uid ? user2 : user1 })
      )
    );
  }

  async approve(uid: string, request_id: string): Promise<boolean> {
    const request = await this.friendsRequestsModel.findOneAndDelete({ _id: request_id, to: uid });
    if (!request.ok) {
      throw new NotFoundException(`request ${request_id} not found`);
    }
    const { from, to } = request.value;
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
    if (!request.ok) {
      throw new NotFoundException(`request ${request_id} not found`);
    }
    this.eventsService.sendToUser({
      userId: type === 'in' ? request.value.from.toString() : request.value.to.toString(),
      message: 'invalidate_tag',
      args: 'friends',
    });
    return true;
  }

  async remove(uid: string, entry_id: string): Promise<boolean> {
    const request = await this.friendsModel.findOneAndDelete({ _id: entry_id, $or: [{ user1: uid }, { user2: uid }] });
    if (!request.ok) {
      throw new NotFoundException(`friend entry ${entry_id} not found`);
    }
    const { user1, user2 } = request.value;
    this.eventsService.sendToUser({
      userId: user1.toString() === uid ? user2.toString() : user1.toString(),
      message: 'invalidate_tag',
      args: 'friends',
    });
    return true;
  }
}
