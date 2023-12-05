import { BadRequestException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model, ObjectId } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import bcrypt from 'bcrypt';
import { UserDto } from './dto/user.dto';
import { INIT_ID, INIT_PASSWD } from 'src/constants';
import { EventsService } from 'src/events/events.service';
import { TelegramAccount } from 'src/auth/tg/schemas/telegram-account.schema';
import { PublicKey } from 'src/auth/webauthn/schemas/public-key.schema';
import { FriendRequests } from 'src/friends/schemas/friend-requests.schema';
import { Friend } from 'src/friends/schemas/friends.schema';
import { Position } from 'src/position/schemas/position.schema';
import { Settings } from 'src/profile/schemas/settings.schema';
import { TgService } from 'src/auth/tg/tg.service';
import { FriendsService } from 'src/friends/friends.service';

const encryptPassword = (password: string) => {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(password, salt);
};

const initUser: UserDto | undefined =
  INIT_ID && INIT_PASSWD
    ? {
        id: new mongoose.Types.ObjectId(INIT_ID).toString(),
        login: 'init',
        name: 'Initial administrator',
        admin: true,
        enabled: true,
      }
    : undefined;

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(TelegramAccount.name) private telegramAccountsModel: Model<TelegramAccount>,
    @InjectModel(Position.name) private positionsModel: Model<Position>,
    @InjectModel(FriendRequests.name) private friendRequestsModel: Model<FriendRequests>,
    @InjectModel(Friend.name) private friendsModel: Model<Friend>,
    @InjectModel(PublicKey.name) private publicKeysModel: Model<PublicKey>,
    @InjectModel(Settings.name) private settingsModel: Model<Settings>,

    @Inject(forwardRef(() => EventsService))
    private eventsService: EventsService,

    @Inject(forwardRef(() => TgService))
    private tgService: TgService,

    @Inject(forwardRef(() => FriendsService))
    private friendsService: FriendsService
  ) {}

  async create({ password, ...user }: CreateUserDto): Promise<string> {
    const id = await this.findIdByLogin(user.login);
    if (id) {
      throw new BadRequestException(`user ${user.login} exists`);
    }
    const newUser = await this.userModel.create({ ...user, password: encryptPassword(password) });
    return newUser._id.toString();
  }

  async find(id: ObjectId | string): Promise<UserDto> {
    if (initUser && id === initUser.id) {
      return initUser;
    }
    const result = await this.userModel.findById(id).exec();
    if (!result) {
      throw new NotFoundException(`user ${id} not found`);
    }
    return result.toJSON();
  }

  async findAll(): Promise<UserDto[]> {
    const result = await this.userModel.find().exec();
    return Promise.all(
      result.map(async entry => {
        const user: UserDto = entry.toJSON();
        const telegram = (await this.tgService.get(user.id))?.info;
        return { ...user, telegram };
      })
    );
  }

  async verify(login: string, password: string): Promise<UserDto> {
    if (initUser && initUser.login === login && password === INIT_PASSWD) {
      return initUser;
    }
    const user = await this.userModel.findOne({ login });
    if (!user) return null;

    if (!(await bcrypt.compare(password, user.password))) return null;

    return user.toJSON();
  }

  async findIdByLogin(login: string) {
    const { _id } = (await this.userModel.findOne({ login }).exec()) || {};
    return _id;
  }

  async isActive(id: ObjectId | string): Promise<boolean> {
    const { enabled } = (await this.userModel.findById(id).exec()) || {};
    return !!enabled;
  }

  async isAdmin(id: ObjectId | string): Promise<boolean> {
    const { admin } = (await this.userModel.findById(id).exec()) || {};
    return !!admin;
  }

  async update(id: string, update: Partial<Omit<User, 'password'>>): Promise<boolean> {
    if (id === INIT_ID) return false;

    const user = this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`user ${id} not found`);
    }

    await this.userModel.updateOne({ _id: id }, update);

    this.eventsService.sendToUser({ userId: id, message: 'refresh_token' });

    return true;
  }

  async updateOnline(id: string): Promise<boolean> {
    if (id === INIT_ID) return false;

    await this.userModel.updateOne({ _id: id }, { online: new Date() });
    this.eventsService.sendToAdmins({ message: 'invalidate_tag', args: 'users' });
    const friends = await this.friendsService.get(id);
    for (const { uid } of friends) {
      this.eventsService.sendToUser({ userId: uid, message: 'invalidate_tag', args: 'friends' });
    }
    return true;
  }

  async updatePassword(id: string, password?: string): Promise<unknown> {
    if (id === INIT_ID) return false;

    if (!password) return;

    const user = this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`user ${id} not found`);
    }

    return this.userModel.updateOne({ _id: id }, { password: encryptPassword(password) });
  }

  async remove(id: string): Promise<boolean> {
    if (id === INIT_ID) return false;

    await this.userModel.deleteOne({ _id: id });
    await this.telegramAccountsModel.deleteMany({ userId: id });
    await this.positionsModel.deleteMany({ userId: id });
    await this.friendRequestsModel.deleteMany({ $or: [{ from: id }, { to: id }] });
    await this.friendsModel.deleteMany({ $or: [{ user1: id }, { user2: id }] });
    await this.publicKeysModel.deleteMany({ userId: id });
    await this.settingsModel.deleteOne({ userId: id });
    return true;
  }
}
