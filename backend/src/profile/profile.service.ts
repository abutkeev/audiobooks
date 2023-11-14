import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { ProfileDto } from './dto/profile.dto';
import { EventsService } from 'src/events/events.service';
import { NewPasswordDto } from './dto/new-password';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Settings } from './schemas/settings.schema';
import { SettingsDto } from './dto/settings.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Settings.name) private settingsModel: Model<Settings>,
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

  async getSettings(userId: string): Promise<SettingsDto> {
    const result = await this.settingsModel.findOne({ userId });

    if (!result) return {};

    const settings = result.toJSON();
    delete settings.userId;
    return settings;
  }

  async setSettings(userId: string, settings: SettingsDto): Promise<true> {
    await this.settingsModel.updateOne({ userId }, settings, { upsert: true });
    this.eventsService.sendToUser({ userId, message: 'invalidate_tag', args: 'settings' });
    return true;
  }
}
