import { BadRequestException, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class SignUpService {
  constructor(
    private usersService: UsersService,
    private authService: AuthService
  ) {}

  async signUp({ login, password, name }: SignUpDto) {
    const otherId = await this.usersService.findIdByLogin(login);
    if (otherId) {
      throw new BadRequestException(`login ${login} is already used`);
    }

    const uid = await this.usersService.create({ login, password, name, admin: false, enabled: false });
    const user = await this.usersService.find(uid);
    return this.authService.login(user);
  }

  async check(login: string) {
    return !(await this.usersService.findIdByLogin(login));
  }
}
