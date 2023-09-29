import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { BooksService } from './books.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import BookEntryDto from './dto/BookEntryDto';
import BookDto from './dto/BookDto';
import { Admin } from 'src/auth/admin.decorator';
import BookInfoDto from './dto/BookInfoDto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private service: BooksService) {}

  @Get()
  @ApiOperation({ description: 'Get books list' })
  get(): BookEntryDto[] {
    return this.service.getList();
  }

  @Get(':id')
  @ApiOperation({ description: 'Get book info' })
  getBookInfo(@Param('id') id: string): BookDto {
    return this.service.get(id);
  }

  @Admin()
  @Post()
  @ApiOperation({ description: 'Create book' })
  create(@Body() info: BookInfoDto) {
    return this.service.create(info);
  }

  @Admin()
  @Put(':id')
  @ApiOperation({ description: 'Edit book' })
  edit(@Param('id') id: string, @Body() book: BookDto): boolean {
    return this.service.edit(id, book);
  }

  @Admin()
  @Delete(':id')
  @ApiOperation({ description: 'Remove book' })
  remove(@Param('id') id: string): boolean {
    return this.service.remove(id);
  }

  @Admin()
  @Post(':id/chapter/:title')
  @ApiOperation({ description: 'Add chapter' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Filename must be url encoded'
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadChapter(
    @Param('id') id: string,
    @Param('title') title: string,
    @UploadedFile() file: Express.Multer.File
  ): boolean {
    return this.service.uploadChapter(id, title, file);
  }
}
