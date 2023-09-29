import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BooksService } from './books.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import BookEntryDto from './dto/BookEntryDto';
import BookDto from './dto/BookDto';
import { Admin } from 'src/auth/admin.decorator';
import BookInfoDto from './dto/BookInfoDto';

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
}
