import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { ProfileDto } from './dto/profile.dto';
import { EventsService } from 'src/events/events.service';
import { NewPasswordDto } from './dto/new-password';

@Injectable()
export class ProfileService {
  constructor(
    private usersService: UsersService,
    private eventsService: EventsService
  ) {}

  async edit(id: string, { login, name }: ProfileDto): Promise<boolean> {
    const otherId = await this.usersService.findIdByLogin(login);
    if (otherId && id !== otherId.toString()) {
      throw new BadRequestException(`login ${login} is already used`);
    }
    await this.usersService.update(id, { login, name });
    this.eventsService.sendToUser({ userId: id, message: 'refresh_token' });
    this.eventsService.sendToAdmins({ message: 'invalidate_tag', args: 'users' });
    return true;
  }

  async changePassword(id: string, { old_password, new_password }: NewPasswordDto): Promise<true> {
    const user = await this.usersService.find(id);
    if (!user) {
      throw new NotFoundException(`user ${id} is not found`);
    }

    if (!(await this.usersService.verify(user.login, old_password))) {
      throw new ForbiddenException('wrong old password');
    }

    await this.usersService.updatePassword(id, new_password);
    return true;
  }
}
