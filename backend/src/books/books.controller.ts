import { Controller, Get } from '@nestjs/common';
import { BooksService } from './books.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import BookEntryDto from './dto/BookEntryDto';

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private service: BooksService) {}

  @Get()
  @ApiOperation({ description: 'Get books list' })
  get(): BookEntryDto[] {
    return this.service.getList();
  }
}
