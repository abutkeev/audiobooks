import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException, forwardRef } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { UserDto } from 'src/users/dto/user.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService
  ) {
    super({ usernameField: 'login' });
  }

  async validate(username: string, password: string): Promise<UserDto> {
    const user = await this.usersService.verify(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
