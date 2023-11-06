import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FriendsService } from './friends.service';
import { AddFriendRequestDto } from './dto/add-friend-request.dto';
import { FriendRequestDto } from './dto/friend-request.dto';

@ApiTags('friends')
@Controller('friends')
export class FriendsController {
  constructor(private friendsService: FriendsService) {}

  @Post('request')
  add(@Body() { login }: AddFriendRequestDto, @Request() { user: { id } }): Promise<boolean> {
    return this.friendsService.addRequest(id, login);
  }

  @Get('requests/in')
  getIncomingRequests(@Request() { user: { id } }): Promise<FriendRequestDto[]> {
    return this.friendsService.getRequests(id, 'in');
  }

  @Get('requests/out')
  getOutgoingRequests(@Request() { user: { id } }): Promise<FriendRequestDto[]> {
    return this.friendsService.getRequests(id, 'out');
  }

  @Post('request/approve/:id')
  approveRequest(@Param('id') request_id: string, @Request() { user: { id } }) {
    return this.friendsService.approve(id, request_id);
  }
}
