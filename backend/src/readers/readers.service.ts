import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate, validateSync } from 'class-validator';
import { CommonService } from 'src/common/common.service';
import { PersonDto } from 'src/interfaces';

const logger = new Logger('ReadersService');
const configName = 'readers.json';
const instanceName = 'reader';

@Injectable()
export class ReadersService {
  constructor(private commonService: CommonService) {}

  get(): PersonDto[] {
    try {
      const result = this.commonService.readJSONFile(configName);
      if (!Array.isArray(result)) {
        logger.log(result);
        throw new Error('result is not array');
      }

      for (const entry of result) {
        const errors = validateSync(plainToInstance(PersonDto, entry));
        if (errors.length > 0) {
          for (const error of errors) {
            logger.error(error);
          }
          logger.log(entry);
          throw new Error('entry validation failed');
        }
      }
      return result as PersonDto[];
    } catch (e) {
      logger.error(e);
      throw new InternalServerErrorException(`can't get ${instanceName}s`);
    }
  }

  create(name: string) {
    try {
      const storage = this.get();
      storage.push({ id: this.commonService.generateID(), name });
      this.commonService.writeJSONFile(configName, storage);
    } catch (e) {
      logger.error(e);
      throw new InternalServerErrorException(`can't create ${instanceName} ${name}`);
    }
  }
}
