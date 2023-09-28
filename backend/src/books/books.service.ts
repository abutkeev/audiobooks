import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { CommonService } from 'src/common/common.service';
import BookEntryDto from './dto/BookEntryDto';
import BookDto from './dto/BookDto';

const logger = new Logger('BooksService');
const configName = 'books.json';
const getBookInfoConfig = (id: string) => `books/${id}/info.json`;
@Injectable()
export class BooksService {
  constructor(private commonService: CommonService) {}

  getList(): BookEntryDto[] {
    try {
      const result = this.commonService.readJSONFile(configName);
      if (!Array.isArray(result)) {
        logger.log(result);
        throw new Error('result is not array');
      }

      for (const entry of result) {
        const errors = validateSync(plainToInstance(BookEntryDto, entry));
        if (errors.length > 0) {
          for (const error of errors) {
            logger.error(error);
          }
          logger.log(entry);
          throw new Error('entry validation failed');
        }
      }
      return result as BookEntryDto[];
    } catch (e) {
      logger.error(e);
      throw new InternalServerErrorException(`can't get books`);
    }
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
