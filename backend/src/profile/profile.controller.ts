import { Body, Controller, Put, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { ProfileDto } from './dto/profile.dto';

@ApiTags('profile', 'users')
@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Put()
  edit(@Body() profile: ProfileDto, @Request() { user }) {
    return this.profileService.edit(user.id, profile);
  }
}
