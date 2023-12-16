import { Body, Controller, Delete, Get, Param, Post, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FriendsService } from './friends.service';
import { AddFriendRequestDto } from './dto/add-friend-request.dto';
import { FriendDto } from './dto/friend.dto';
import { HasOnlineTag } from 'src/auth/has-online-tag.decorator';

@ApiTags('friends')
@Controller('friends')
export class FriendsController {
  constructor(private friendsService: FriendsService) {}

  @HasOnlineTag()
  @Get()
  get(@Request() { user: { id } }): Promise<FriendDto[]> {
    return this.friendsService.get(id);
  }

  @Delete(':entry_id')
  remove(@Param('entry_id') entry_id: string, @Request() { user: { id } }): Promise<boolean> {
    return this.friendsService.remove(id, entry_id);
  }

  @Post('request')
  add(@Body() { login }: AddFriendRequestDto, @Request() { user: { id } }): Promise<boolean> {
    return this.friendsService.addRequest(id, login);
  }

  @Get('requests/in')
  getIncomingRequests(@Request() { user: { id } }): Promise<FriendDto[]> {
    return this.friendsService.getRequests(id, 'in');
  }

  @Get('requests/out')
  getOutgoingRequests(@Request() { user: { id } }): Promise<FriendDto[]> {
    return this.friendsService.getRequests(id, 'out');
  }

  @Post('request/approve/:id')
  approveRequest(@Param('id') request_id: string, @Request() { user: { id } }) {
    return this.friendsService.approve(id, request_id);
  }

  @Delete('request/in/:id')
  removeIncomingRequest(@Param('id') request_id: string, @Request() { user: { id } }) {
    return this.friendsService.removeRequest(id, request_id, 'in');
  }

  @Delete('request/out/:id')
  removeOutgoingRequest(@Param('id') request_id: string, @Request() { user: { id } }) {
    return this.friendsService.removeRequest(id, request_id, 'out');
  }
}
