import { Controller, Get, Param, Request } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PositionService } from './position.service';
import { PositionEntryDto } from './dto/position-entry.dto';

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
}
