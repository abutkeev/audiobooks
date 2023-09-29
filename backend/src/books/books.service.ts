import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { CommonService } from 'src/common/common.service';
import BookEntryDto from './dto/BookEntryDto';
import BookDto from './dto/BookDto';
import { existsSync, lstatSync, readdirSync } from 'fs';
import path from 'path';
import { DataDir } from 'src/constants';

const logger = new Logger('BooksService');
const getBookInfoConfig = (id: string) => `books/${id}/info.json`;
const booksDir = path.resolve(DataDir, 'books');

@Injectable()
export class BooksService {
  constructor(private commonService: CommonService) {}

  getList(): BookEntryDto[] {
    if (!existsSync(booksDir) || !lstatSync(booksDir)?.isDirectory()) return [];

    const books: BookEntryDto[] = [];
    const dirEntries = readdirSync(booksDir);

    for (const id of dirEntries) {
      if (id.startsWith('.')) continue;
      
      try {
        const { info } = this.get(id);
        books.push({ id, info });
      } catch (e) {
        logger.error(`can't read book ${id}`);
        logger.error(e);
      }
    }
    return books;
  }

  get(id: string): BookDto {
    try {
      const result = this.commonService.readJSONFile(getBookInfoConfig(id));
      const errors = validateSync(plainToInstance(BookDto, result));
      if (errors.length > 0) {
        for (const error of errors) {
          logger.error(error);
        }
        logger.log(result);
        throw new Error('entry validation failed');
      }
      return result as BookDto;
    } catch (e) {
      logger.error(e);
      if (e instanceof NotFoundException) {
        throw new NotFoundException(`book ${id} not found`);
      }
      throw new InternalServerErrorException(`can't get book ${id}`);
    }
  }
}
