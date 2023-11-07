import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Position } from './schemas/position.schema';
import { PositionDto } from './dto/position.dto';
import { EventsService } from 'src/events/events.service';
import { FriendsService } from 'src/friends/friends.service';
import { FriendPositionEntryDto } from './dto/friend-position-entry.dto';

@Injectable()
export class PositionService {
  constructor(
    @InjectModel(Position.name) private positionModel: Model<Position>,

    private friendsService: FriendsService,

    @Inject(forwardRef(() => EventsService))
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

  async getFriends({ uid, bookId }: { uid: string; bookId: string }): Promise<FriendPositionEntryDto[]> {
    const friends = await this.friendsService.get(uid);
    const friendIds = friends.map(({ uid }) => uid);
    const positions = await this.positionModel.find({ bookId, userId: { $in: friendIds } });

    return positions.map(({ instanceId, currentChapter, position, updated, userId }) => {
      const { uid, login, name } = friends.find(({ uid }) => uid === userId.toString()) || {};
      return { instanceId, currentChapter, position, updated, friendId: uid, friendLogin: login, friendName: name };
    });
  }
}
