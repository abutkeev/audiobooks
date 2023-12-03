import { BadRequestException, Injectable } from '@nestjs/common';
import { BooksService } from 'src/books/books.service';
import PersonDto from 'src/persons/dto/PersonDto';
import { PersonsService } from 'src/persons/persons.service';

@Injectable()
export class ReadersService {
  constructor(
    private personsService: PersonsService,
    private booksService: BooksService
  ) {}

  get(): PersonDto[] {
    return this.personsService.get('reader');
  }

  create(name: string) {
    return this.personsService.create('reader', name);
  }

  edit(id: string, name: string) {
    return this.personsService.edit('reader', id, name);
  }

  remove(id: string) {
    const books = this.booksService.getList();

    for (const { id: book_id } of books) {
      const book = this.booksService.get(book_id);
      if (book.info.readers.includes(id) && book.info.readers.length === 1) {
        throw new BadRequestException(`can't remove the only reader of book ${book.info.name}`);
      }
    }

    for (const { id: book_id } of books) {
      const book = this.booksService.get(book_id);
      if (book.info.readers.includes(id)) {
        const { info, ...other } = book;
        info.readers = info.readers.filter(item => item !== id);
        this.booksService.edit(book_id, { info, ...other });
      }
    }

    return this.personsService.remove('reader', id);
  }
}
