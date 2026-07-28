import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Position } from './schemas/position.schema';
import { PositionDto } from './dto/position.dto';
import { EventsService } from 'src/events/events.service';
import { FriendsService } from 'src/friends/friends.service';
import { FriendPositionEntryDto } from './dto/friend-position-entry.dto';
import { FriendPositionsDto } from './dto/friend-positions.dto';
import { UserPositionEntryDto } from './dto/user-position-entry.dto';
import { UserPositionsDto } from './dto/user-positions.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PositionService {
  constructor(
    @InjectModel(Position.name) private positionModel: Model<Position>,

    private friendsService: FriendsService,

    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,

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
    await this.notifyPositionChange(userId);
    return result;
  }

  async remove({ userId, instanceId, bookId }: { userId: string; instanceId: string; bookId: string }): Promise<true> {
    await this.positionModel.deleteOne({ userId, instanceId, bookId });
    await this.notifyPositionChange(userId);
    return true;
  }

  private async notifyPositionChange(userId: string) {
    this.eventsService.sendToUser({ userId, message: 'invalidate_tag', args: 'position' });
    const friends = await this.friendsService.get(userId);
    for (const { uid } of friends) {
      this.eventsService.sendToUser({ userId: uid, message: 'invalidate_tag', args: 'position' });
    }
    const notified = [userId, ...friends.map(({ uid }) => uid)];
    await this.eventsService.sendToAdmins({ message: 'invalidate_tag', args: 'position', skipUsers: notified });
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

  async getUser({ userId, bookId }: { userId: string; bookId: string }): Promise<UserPositionEntryDto[]> {
    const { id, login, name } = await this.usersService.find(userId);
    const positions = await this.positionModel.find({ bookId, userId: id });

    return positions.map(({ instanceId, currentChapter, position, updated }) => ({
      instanceId,
      currentChapter,
      position,
      updated: updated.toISOString(),
      userId: id,
      userLogin: login,
      userName: name,
    }));
  }

  getAll(userId: string) {
    return this.positionModel.find({ userId });
  }

  async getUsersAll(): Promise<UserPositionsDto[]> {
    const positionsList = await this.positionModel.find();

    return positionsList.reduce((result: UserPositionsDto[], { userId, bookId, currentChapter, position, updated }) => {
      if (currentChapter === 0 && position === 0) {
        return result;
      }

      const entry = { bookId, currentChapter, position, updated: updated.toISOString() };
      const user = result.find(({ userId: id }) => id === userId.toString());
      if (user) {
        user.positions.push(entry);
        return result;
      }

      result.push({ userId: userId.toString(), positions: [entry] });
      return result;
    }, []);
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
