import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CommonService } from 'src/common/common.service';
import SeriesDto from './dto/SeriesDto';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import NewSeriesDto from './dto/NewSeriesDto';
import OldSeriesDto from './dto/OldSeriesDto';
import { BooksService } from 'src/books/books.service';

const logger = new Logger('SeriesService');
const configName = 'series.json';
const instanceName = 'series';

@Injectable()
export class SeriesService {
  constructor(
    private commonService: CommonService,
    private booksService: BooksService
  ) {}

  private check_config(config: unknown): config is (OldSeriesDto | SeriesDto)[] {
    if (!Array.isArray(config)) {
      logger.log(config);
      throw new Error('result is not array');
    }

    for (const entry of config) {
      if (validateSync(plainToInstance(OldSeriesDto, entry)).length === 0) {
        continue;
      }
      const errors = validateSync(plainToInstance(SeriesDto, entry));
      if (errors.length > 0) {
        for (const error of errors) {
          logger.error(error);
        }
        logger.log(entry);
        throw new Error('entry validation failed');
      }
    }
    return true;
  }

  get(): SeriesDto[] {
    try {
      const config = this.commonService.readJSONFile(configName) || [];
      if (!this.check_config(config)) {
        throw new Error('config validation failed');
      }
      const result = config.map(entry => {
        if ('author_id' in entry) {
          const { author_id, ...other } = entry;
          const newEntry: SeriesDto = {
            ...other,
            authors: [author_id],
          };
          return newEntry;
        }
        return entry;
      });
      return result;
    } catch (e) {
      logger.error(e);
      throw new InternalServerErrorException(`can't get ${instanceName}`);
    }
  }

  create({ name, authors }: NewSeriesDto) {
    try {
      const storage = this.get();
      storage.push({ id: this.commonService.generateID(), name, authors });
      this.commonService.writeJSONFile(configName, storage);
    } catch (e) {
      logger.error(e);
      throw new InternalServerErrorException(`can't create ${instanceName} ${name}`);
    }
  }

  edit(id: string, data: NewSeriesDto) {
    try {
      const storage = this.get();
      const index = storage.findIndex(item => item.id === id);
      if (index === -1) {
        throw new NotFoundException(`series ${id} not found`);
      }
      storage[index] = { id, ...data };
      this.commonService.writeJSONFile(configName, storage);
    } catch (e) {
      logger.error(e);
      throw new InternalServerErrorException(`can't edit ${instanceName} ${id}`);
    }
  }

  remove(series_id: string) {
    try {
      const storage = this.get();
      const newStorage = storage.filter(item => item.id !== series_id);
      const books = this.booksService.getList();
      for (const { id } of books) {
        const book = this.booksService.get(id);
        if (!book.info.series.some(series => series.id === series_id)) {
          continue;
        }
        const { series, ...other } = book.info;
        const info = {
          series: series.filter(entry => entry.id !== series_id),
          ...other,
        };
        this.booksService.edit(id, { info, chapters: book.chapters });
      }
      this.commonService.writeJSONFile(configName, newStorage);
    } catch (e) {
      logger.error(e);
      throw new InternalServerErrorException(`can't edit ${instanceName} ${series_id}`);
    }
  }
}
