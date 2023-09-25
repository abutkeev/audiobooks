import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Position } from './schemas/position.schema';
import { PositionDto } from './dto/position.dto';
import { EventsService } from 'src/events/events.service';

@Injectable()
export class PositionService {
  constructor(
    @InjectModel(Position.name) private positionModel: Model<Position>,
    private eventsService: EventsService
  ) {}

  find(userId: string, bookId: string) {
    return this.positionModel.find({ userId, bookId });
  }

  async savePosition(userId: string, instanceId: string, position: PositionDto) {
    const result = await this.positionModel.replaceOne(
      { userId, instanceId },
      { userId, instanceId, ...position },
      { upsert: true }
    );
    this.eventsService.sendToUser({ userId, skipInstance: instanceId, message: 'invalidate_tag', args: 'position' });
    return result;
  }
}