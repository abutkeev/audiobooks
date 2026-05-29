import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookmarksService } from './bookmarks.service';
import { BookmarksController } from './bookmarks.controller';
import { Bookmark, BookmarkSchema } from './schemas/bookmark.schema';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Bookmark.name, schema: BookmarkSchema }]),
    forwardRef(() => EventsModule),
  ],
  providers: [BookmarksService],
  exports: [BookmarksService],
  controllers: [BookmarksController],
})
export class BookmarksModule {}
