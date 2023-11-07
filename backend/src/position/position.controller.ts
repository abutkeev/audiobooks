import { Controller, Get, Param, Request } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PositionService } from './position.service';
import { PositionEntryDto } from './dto/position-entry.dto';
import { FriendPositionEntryDto } from './dto/friend-position-entry.dto';

@ApiTags('position')
@Controller('position')
export class PositionController {
  constructor(private positionService: PositionService) {}

  @Get(':bookId')
  @ApiOperation({ description: 'Get user positions for book' })
  async getBook(@Param('bookId') bookId: string, @Request() { user: { id } }): Promise<PositionEntryDto[]> {
    const result = await this.positionService.find(id, bookId);
    return result.map(({ instanceId, currentChapter, position, updated }) => ({
      instanceId,
      currentChapter,
      position,
      updated,
    }));
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
