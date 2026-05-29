import { Body, Controller, Delete, Get, Param, Post, Put, Request } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BookmarksService } from './bookmarks.service';
import { BookmarkDto } from './dto/bookmark.dto';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';

@ApiTags('bookmarks')
@Controller('bookmarks')
export class BookmarksController {
  constructor(private bookmarksService: BookmarksService) {}

  @Get(':bookId')
  @ApiOperation({ description: 'Get user bookmarks for book' })
  getBook(@Param('bookId') bookId: string, @Request() { user: { id } }): Promise<BookmarkDto[]> {
    return this.bookmarksService.find(id, bookId);
  }

  @Post()
  @ApiOperation({ description: 'Create bookmark' })
  create(@Body() dto: CreateBookmarkDto, @Request() { user: { id } }): Promise<BookmarkDto> {
    return this.bookmarksService.create(id, dto);
  }

  @Put(':id')
  @ApiOperation({ description: 'Rename bookmark' })
  update(@Param('id') id: string, @Body() dto: UpdateBookmarkDto, @Request() { user }): Promise<BookmarkDto> {
    return this.bookmarksService.update(user.id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ description: 'Remove bookmark' })
  remove(@Param('id') id: string, @Request() { user }): Promise<true> {
    return this.bookmarksService.remove(user.id, id);
  }
}
