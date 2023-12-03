import { BadRequestException, Injectable } from '@nestjs/common';
import { BooksService } from 'src/books/books.service';
import PersonDto from 'src/persons/dto/PersonDto';
import { PersonsService } from 'src/persons/persons.service';

@Injectable()
export class AuthorsService {
  constructor(
    private personsService: PersonsService,
    private booksService: BooksService
  ) {}

  get(): PersonDto[] {
    return this.personsService.get('author');
  }

  create(name: string) {
    return this.personsService.create('author', name);
  }

  edit(id: string, name: string) {
    return this.personsService.edit('author', id, name);
  }

  remove(id: string) {
    const books = this.booksService.getList();

    for (const { id: book_id } of books) {
      const book = this.booksService.get(book_id);
      if (book.info.authors.includes(id) && book.info.authors.length === 1) {
        throw new BadRequestException(`can't remove the only author of book ${book.info.name}`);
      }
    }

    for (const { id: book_id } of books) {
      const book = this.booksService.get(book_id);
      if (book.info.authors.includes(id)) {
        const { info, ...other } = book;
        info.authors = info.authors.filter(item => item !== id);
        this.booksService.edit(book_id, { info, ...other });
      }
    }

    return this.personsService.remove('author', id);
  }
}
