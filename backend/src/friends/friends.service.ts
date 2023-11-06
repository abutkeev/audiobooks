import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { FriendRequests } from './schemas/friend-requests.schema';
import { FriendRequestDto } from './dto/friend-request.dto';

@Injectable()
export class FriendsService {
  constructor(
    @InjectModel(FriendRequests.name) private friendsRequestsModel: Model<FriendRequests>,
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

    await this.friendsRequestsModel.create({ from, to });
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
}
