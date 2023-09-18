import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Socket } from 'socket.io';
import { Position } from './schemas/position.schema';
import { Model } from 'mongoose';
import { PositionDto } from './dto/position.dto';

@Injectable()
export class EventsService {
  private sockets: Record<string, { instanceId: string; socket: Socket }[]> = {};
  constructor(@InjectModel(Position.name) private positionModel: Model<Position>) {}

  registerSocket(userId: string, instanceId: string, socket: Socket) {
    if (!this.sockets[userId]) {
      this.sockets[userId] = [];
    }
    this.sockets[userId].push({ socket, instanceId });
  }

  unregisterSocket(userId: string, socket: Socket) {
    if (!this.sockets[userId]) return;

    this.sockets[userId] = this.sockets[userId].filter(({ socket: { id } }) => socket.id !== id);
  }

  savePosition(userId: string, instanceId: string, position: PositionDto) {
    return this.positionModel.replaceOne({ userId, instanceId }, { userId, instanceId, ...position }, { upsert: true });
  }
}
