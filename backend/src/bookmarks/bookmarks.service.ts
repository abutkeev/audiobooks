import { ForbiddenException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bookmark } from './schemas/bookmark.schema';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { BookmarkDto } from './dto/bookmark.dto';
import { EventsService } from 'src/events/events.service';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectModel(Bookmark.name) private bookmarkModel: Model<Bookmark>,

    @Inject(forwardRef(() => EventsService))
    private eventsService: EventsService
  ) {
    bookmarkModel.syncIndexes();
  }

  private toDto({ _id, bookId, name, currentChapter, position, updated }: Bookmark & { _id: unknown }): BookmarkDto {
    return {
      id: String(_id),
      bookId,
      name,
      currentChapter,
      position,
      updated: updated.toISOString(),
    };
  }

  async find(userId: string, bookId: string): Promise<BookmarkDto[]> {
    const bookmarks = await this.bookmarkModel.find({ userId, bookId }).sort({ currentChapter: 1, position: 1 });
    return bookmarks.map(bookmark => this.toDto(bookmark));
  }

  async create(userId: string, dto: CreateBookmarkDto): Promise<BookmarkDto> {
    const bookmark = await this.bookmarkModel.create({ userId, ...dto, updated: new Date() });
    this.eventsService.sendToUser({ userId, message: 'invalidate_tag', args: 'bookmarks' });
    return this.toDto(bookmark);
  }

  async update(userId: string, id: string, dto: UpdateBookmarkDto): Promise<BookmarkDto> {
    const bookmark = await this.bookmarkModel.findById(id);
    if (!bookmark) {
      throw new NotFoundException('Bookmark not found');
    }
    if (bookmark.userId.toString() !== userId) {
      throw new ForbiddenException();
    }
    bookmark.name = dto.name;
    bookmark.updated = new Date();
    await bookmark.save();
    this.eventsService.sendToUser({ userId, message: 'invalidate_tag', args: 'bookmarks' });
    return this.toDto(bookmark);
  }

  async remove(userId: string, id: string): Promise<true> {
    const bookmark = await this.bookmarkModel.findById(id);
    if (!bookmark) {
      throw new NotFoundException('Bookmark not found');
    }
    if (bookmark.userId.toString() !== userId) {
      throw new ForbiddenException();
    }
    await bookmark.deleteOne();
    this.eventsService.sendToUser({ userId, message: 'invalidate_tag', args: 'bookmarks' });
    return true;
  }
}
