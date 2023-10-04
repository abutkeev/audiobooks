import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model, ObjectId } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import bcrypt from 'bcrypt';
import { UserDto } from './dto/user.dto';
import { INIT_ID, INIT_PASSWD } from 'src/constants';

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
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

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
    return result.map(entry => entry.toJSON());
  }

  async verify(login: string, password: string): Promise<UserDto> {
    if (initUser && initUser.login === login && password === INIT_PASSWD) {
      return initUser;
    }
    const result = await this.userModel.find({ login });
    if (result.length === 0) return null;
    const user = result[0];

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

  async update(id: string, update: Partial<Omit<User, 'password'>>): Promise<unknown> {
    const user = this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`user ${id} not found`);
    }

    return this.userModel.updateOne({ _id: id }, update);
  }

  async updatePassword(id: string, password?: string): Promise<unknown> {
    if (!password) return;

    const user = this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`user ${id} not found`);
    }

    return this.userModel.updateOne({ _id: id }, { password: encryptPassword(password) });
  }
}
