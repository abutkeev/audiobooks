import { Injectable } from '@nestjs/common';
import PersonDto from 'src/persons/dto/PersonDto';
import { PersonsService } from 'src/persons/persons.service';

@Injectable()
export class ReadersService {
  constructor(private personsService: PersonsService) {}

  get(): PersonDto[] {
    return this.personsService.get('reader');
  }

  create(name: string) {
    return this.personsService.create('reader', name);
  }
}
