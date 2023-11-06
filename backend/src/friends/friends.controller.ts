import { Body, Controller, Post, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FriendsService } from './friends.service';
import { AddFriendRequestDto } from './dto/add-friend-request.dto';

@ApiTags('friends')
@Controller('friends')
export class FriendsController {
  constructor(private friendsService: FriendsService) {}

  @Post('request')
  add(@Body() { login }: AddFriendRequestDto, @Request() { user: { id } }): Promise<boolean> {
    return this.friendsService.addRequest(id, login);
  }
}
