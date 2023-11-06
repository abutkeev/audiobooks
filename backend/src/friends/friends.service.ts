import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { FriendRequests } from './schemas/friend-requests.schema';

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
}
