import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { CommonService } from 'src/common/common.service';
import PersonDto from './dto/PersonDto';

const logger = new Logger('PersonsService');

type PersonType = 'reader' | 'author';
const getConfigName = (type: PersonType) => `${type}s.json`;

@Injectable()
export class PersonsService {
  constructor(private commonService: CommonService) {}

  get(type: PersonType): PersonDto[] {
    try {
      const result = this.commonService.readJSONFile(getConfigName(type));
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
      throw new InternalServerErrorException(`can't get ${type}s`);
    }
  }

  create(type: PersonType, name: string) {
    try {
      const storage = this.get(type);
      storage.push({ id: this.commonService.generateID(), name });
      this.commonService.writeJSONFile(getConfigName(type), storage);
    } catch (e) {
      logger.error(e);
      throw new InternalServerErrorException(`can't create ${type} ${name}`);
    }
  }

  edit(type: PersonType, id: string, name: string) {
    try {
      const storage = this.get(type);
      const index = storage.findIndex(item => item.id === id);
      if (index === -1) {
        throw new NotFoundException(`${type} ${id} not found`);
      }
      storage[index] = { id, name };
      this.commonService.writeJSONFile(getConfigName(type), storage);
    } catch (e) {
      logger.error(e);
      throw new InternalServerErrorException(`can't edit ${type} ${id}`);
    }
  }

  remove(type: PersonType, id: string) {
    try {
      const storage = this.get(type);
      const newStorage = storage.filter(item => item.id !== id);
      this.commonService.writeJSONFile(getConfigName(type), newStorage);
    } catch (e) {
      logger.error(e);
      throw new InternalServerErrorException(`can't remove ${type} ${id}`);
    }
  }
}
