import { BadRequestException, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SignUpService {
  constructor(private usersService: UsersService) {}

  async signUp({ login, password, name }: SignUpDto) {
    const otherId = await this.usersService.findIdByLogin(login);
    if (otherId) {
      throw new BadRequestException(`login ${login} is already used`);
    }

    return this.usersService.create({ login, password, name, admin: false, enabled: false });
  }
}
