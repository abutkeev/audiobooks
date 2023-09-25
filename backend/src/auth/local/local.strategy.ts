import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { UserDto } from 'src/users/dto/user.dto';
import mongoose from 'mongoose';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({ usernameField: 'login' });
  }

  async validate(username: string, password: string): Promise<UserDto> {
    if (process.env.INIT_ID && process.env.INIT_PASSWD && username === 'init' && password === process.env.INIT_PASSWD) {
      return {
        id: new mongoose.Types.ObjectId(process.env.INIT_ID).toString(),
        login: 'init',
        name: 'Initial administrator',
        admin: true,
        enabled: true,
      };
    }
    const user = await this.usersService.verify(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
