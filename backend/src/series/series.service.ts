import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CommonService } from 'src/common/common.service';
import SeriesDto from './dto/SeriesDto';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import NewSeriesDto from './dto/NewSeriesDto';

const logger = new Logger('SeriesService');
const configName = 'series.json';
const instanceName = 'series';

@Injectable()
export class SeriesService {
  constructor(private commonService: CommonService) {}

  get(): SeriesDto[] {
    try {
      const result = this.commonService.readJSONFile(configName);
      if (!Array.isArray(result)) {
        logger.log(result);
        throw new Error('result is not array');
      }

      for (const entry of result) {
        const errors = validateSync(plainToInstance(SeriesDto, entry));
        if (errors.length > 0) {
          for (const error of errors) {
            logger.error(error);
          }
          logger.log(entry);
          throw new Error('entry validation failed');
        }
      }
      return result as SeriesDto[];
    } catch (e) {
      logger.error(e);
      throw new InternalServerErrorException(`can't get ${instanceName}`);
    }
  }

  create({ name, author_id }: NewSeriesDto) {
    try {
      const storage = this.get();
      storage.push({ id: this.commonService.generateID(), name, author_id, books: [] });
      this.commonService.writeJSONFile(configName, storage);
    } catch (e) {
      logger.error(e);
      throw new InternalServerErrorException(`can't create ${instanceName} ${name}`);
    }
  }
}
