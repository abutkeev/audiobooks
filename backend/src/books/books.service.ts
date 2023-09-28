import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { CommonService } from 'src/common/common.service';
import BookEntryDto from './dto/BookEntryDto';

const logger = new Logger('BooksService');
const configName = 'books.json';

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
}
