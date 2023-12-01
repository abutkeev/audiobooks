import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CommonService } from 'src/common/common.service';
import SeriesDto from './dto/SeriesDto';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import NewSeriesDto from './dto/NewSeriesDto';
import OldSeriesDto from './dto/OldSeriesDto';

const logger = new Logger('SeriesService');
const configName = 'series.json';
const instanceName = 'series';

@Injectable()
export class SeriesService {
  constructor(private commonService: CommonService) {}

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
      const config = this.commonService.readJSONFile(configName);
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
}
