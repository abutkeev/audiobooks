import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Position } from './schemas/position.schema';
import { PositionDto } from './dto/position.dto';
import { EventsService } from 'src/events/events.service';
import { FriendsService } from 'src/friends/friends.service';
import { FriendPositionEntryDto } from './dto/friend-position-entry.dto';
import { FriendPositionsDto } from './dto/friend-positions.dto';

@Injectable()
export class PositionService {
  constructor(
    @InjectModel(Position.name) private positionModel: Model<Position>,

    private friendsService: FriendsService,

    @Inject(forwardRef(() => EventsService))
    private eventsService: EventsService
  ) {
    positionModel.syncIndexes();
  }

  find(userId: string, bookId: string) {
    return this.positionModel.find({ userId, bookId });
  }

  async savePosition(userId: string, instanceId: string, position: PositionDto) {
    const current = await this.positionModel.findOne({ userId, instanceId, bookId: position.bookId });

    if (current && position.currentChapter === current.currentChapter && position.position === current.position) {
      return;
    }

    const result = await this.positionModel.replaceOne(
      { userId, instanceId, bookId: position.bookId },
      { userId, instanceId, ...position },
      { upsert: true }
    );
    this.eventsService.sendToUser({ userId, message: 'invalidate_tag', args: 'position' });
    for (const { uid } of await this.friendsService.get(userId)) {
      this.eventsService.sendToUser({ userId: uid, message: 'invalidate_tag', args: 'position' });
    }
    return result;
  }

  async remove({ userId, instanceId, bookId }: { userId: string; instanceId: string; bookId: string }): Promise<true> {
    await this.positionModel.deleteOne({ userId, instanceId, bookId });
    this.eventsService.sendToUser({ userId, message: 'invalidate_tag', args: 'position' });
    for (const { uid } of await this.friendsService.get(userId)) {
      this.eventsService.sendToUser({ userId: uid, message: 'invalidate_tag', args: 'position' });
    }
    return true;
  }

  async getFriends({ uid, bookId }: { uid: string; bookId: string }): Promise<FriendPositionEntryDto[]> {
    const friends = await this.friendsService.get(uid);
    const friendIds = friends.map(({ uid }) => uid);
    const positions = await this.positionModel.find({ bookId, userId: { $in: friendIds } });

    return positions.map(({ instanceId, currentChapter, position, updated, userId }) => {
      const { uid, login, name } = friends.find(({ uid }) => uid === userId.toString()) || {};
      return {
        instanceId,
        currentChapter,
        position,
        updated: updated.toISOString(),
        friendId: uid,
        friendLogin: login,
        friendName: name,
      };
    });
  }

  getAll(userId: string) {
    return this.positionModel.find({ userId });
  }

  async getFriendsAll(uid: string): Promise<FriendPositionsDto[]> {
    const friends = await this.friendsService.get(uid);
    const friendIds = friends.map(({ uid }) => uid);
    const positionsList = await this.positionModel.find({ userId: { $in: friendIds } });

    const result = friends.reduce((result: FriendPositionsDto[], friend) => {
      const positions = positionsList.filter(
        ({ userId, currentChapter, position }) =>
          friend.uid === userId.toString() && !(currentChapter === 0 && position === 0)
      );
      if (positions.length !== 0) {
        result.push({
          friend,
          positions: positions.map(({ bookId, currentChapter, position, updated }) => ({
            bookId,
            currentChapter,
            position,
            updated: updated.toISOString(),
          })),
        });
      }
      return result;
    }, []);

    return result;
  }
}
