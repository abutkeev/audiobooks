import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Document, Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import bcrypt from 'bcrypt';
import { UserDto } from './dto/user.dto';

const encryptPassword = (password: string) => {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(password, salt);
};

const getUserDto = ({ _id, login }: User & Document): UserDto => ({ id: _id.toString(), login });

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create({ password, ...user }: CreateUserDto): Promise<string> {
    const result = await this.userModel.find({ login: user.login });
    if (result.length) {
      throw new BadRequestException(`user ${user.login} exists`);
    }
    const newUser = await this.userModel.create({ ...user, password: encryptPassword(password) });
    return newUser._id.toString();
  }

  async findAll(): Promise<UserDto[]> {
    const result = await this.userModel.find().exec();
    return result.map(getUserDto);
  }

  async verify(login: string, password: string) {
    const result = await this.userModel.find({ login });
    if (result.length === 0) return null;
    const user = result[0];

    if (!(await bcrypt.compare(password, user.password))) return null;

    return getUserDto(user);
  }
}
