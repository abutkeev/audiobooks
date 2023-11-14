import { Body, Controller, Get, Post, Put, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { ProfileDto } from './dto/profile.dto';
import { NewPasswordDto } from './dto/new-password';
import { AllowInactive } from 'src/auth/allow-inactive.decorator';
import { SettingsDto } from './dto/settings.dto';

@AllowInactive()
@ApiTags('profile', 'users')
@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Put()
  edit(@Body() profile: ProfileDto, @Request() { user }) {
    return this.profileService.edit(user.id, profile);
  }

  @Post('password')
  changePassword(@Body() data: NewPasswordDto, @Request() { user }) {
    return this.profileService.changePassword(user.id, data);
  }

  @Get('settings')
  @ApiTags('settings')
  getSettings(@Request() { user }) {
    return this.profileService.getSettings(user.id);
  }

  @Put('settings')
  @ApiTags('settings')
  setSettings(@Body() settings: SettingsDto, @Request() { user }) {
    return this.profileService.setSettings(user.id, settings);
  }
}
