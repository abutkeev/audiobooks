import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Position } from './schemas/position.schema';
import { PositionDto } from './dto/position.dto';

@Injectable()
export class PositionService {
  constructor(@InjectModel(Position.name) private positionModel: Model<Position>) {}

  savePosition(userId: string, instanceId: string, position: PositionDto) {
    return this.positionModel.replaceOne({ userId, instanceId }, { userId, instanceId, ...position }, { upsert: true });
  }
}
