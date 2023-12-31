import { Controller, Delete, Get, Param, Request } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PositionService } from './position.service';
import { PositionEntryDto } from './dto/position-entry.dto';
import { FriendPositionEntryDto } from './dto/friend-position-entry.dto';
import { PositionDto } from './dto/position.dto';
import { FriendPositionsDto } from './dto/friend-positions.dto';
import { HasOnlineTag } from 'src/auth/has-online-tag.decorator';

@ApiTags('position')
@Controller('position')
export class PositionController {
  constructor(private positionService: PositionService) {}

  @Get()
  @ApiOperation({ description: 'Get all user books positions' })
  async get(@Request() { user }): Promise<PositionDto[]> {
    const result = await this.positionService.getAll(user.id);
    return result.map(({ bookId, instanceId, currentChapter, position, updated }) => ({
      bookId,
      instanceId,
      currentChapter,
      position,
      updated: updated.toISOString(),
    }));
  }

  @HasOnlineTag()
  @Get('friends')
  @ApiOperation({ description: 'Get user friends positions' })
  async getFriends(@Request() { user }): Promise<FriendPositionsDto[]> {
    return this.positionService.getFriendsAll(user.id);
  }

  @Get(':bookId')
  @ApiOperation({ description: 'Get user positions for book' })
  async getBook(@Param('bookId') bookId: string, @Request() { user: { id } }): Promise<PositionEntryDto[]> {
    const result = await this.positionService.find(id, bookId);
    return result.map(({ instanceId, currentChapter, position, updated }) => ({
      instanceId,
      currentChapter,
      position,
      updated: updated.toISOString(),
    }));
  }

  @Delete(':bookId/:instanceId')
  @ApiOperation({ description: 'Remove user positions for book' })
  remove(@Param('bookId') bookId: string, @Param('instanceId') instanceId: string, @Request() { user }) {
    return this.positionService.remove({ userId: user.id, bookId, instanceId });
  }

  @Get(':bookId/friends')
  @ApiOperation({ description: 'Get user friends positions for book' })
  async getFriendsBook(
    @Param('bookId') bookId: string,
    @Request() { user: { id } }
  ): Promise<FriendPositionEntryDto[]> {
    return this.positionService.getFriends({ uid: id, bookId });
  }
}
