import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from 'src/users/dto/user.dto';
import { JwtStrategy } from './jwt/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private jwtStrategy: JwtStrategy
  ) {}

  private logger = new Logger('AuthService');

  async login(user: UserDto) {
    const payload = { username: user.login, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async verify(token: string): Promise<UserDto> {
    try {
      return this.jwtStrategy.validate(this.jwtService.verify(token, { ignoreExpiration: false }));
    } catch (e) {
      this.logger.error('Token verification error', e);
      return null;
    }
  }
}
