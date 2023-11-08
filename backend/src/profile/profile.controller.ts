import { Body, Controller, Post, Put, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { ProfileDto } from './dto/profile.dto';
import { NewPasswordDto } from './dto/new-password';

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
}
