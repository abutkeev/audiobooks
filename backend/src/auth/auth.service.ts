import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from 'src/users/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  private logger = new Logger('AuthService');

  async login(user: UserDto) {
    const payload = { username: user.login, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async verify(token: string): Promise<UserDto> {
    try {
      const { sub: id, username: login } = this.jwtService.verify(token, { ignoreExpiration: false });
      return { id, login };
    } catch (e) {
      this.logger.error('Token verification error', e);
      return null;
    }
  }
}
