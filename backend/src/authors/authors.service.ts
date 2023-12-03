import { Injectable } from '@nestjs/common';
import PersonDto from 'src/persons/dto/PersonDto';
import { PersonsService } from 'src/persons/persons.service';

@Injectable()
export class AuthorsService {
  constructor(private personsService: PersonsService) {}

  get(): PersonDto[] {
    return this.personsService.get('author');
  }

  create(name: string) {
    return this.personsService.create('author', name);
  }

  edit(id: string, name: string) {
    return this.personsService.edit('author', id, name);
  }
}
