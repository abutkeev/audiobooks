import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any): Promise<UserDto> {
    if (
      process.env.INIT_ID &&
      process.env.INIT_PASSWD &&
      payload.sub === process.env.INIT_ID &&
      payload.username === 'init'
    ) {
      return {
        id: payload.sub,
        login: payload.username,
        name: payload.name || '',
        admin: !!payload.admin,
        enabled: !!payload.enabled,
      };
    }
    return this.usersService.find(payload.sub);
  }
}
