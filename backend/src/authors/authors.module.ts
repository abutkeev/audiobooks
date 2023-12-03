import { Module } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { AuthorsController } from './authors.controller';
import { CommonModule } from 'src/common/common.module';
import { PersonsModule } from 'src/persons/persons.module';
import { CommonService } from 'src/common/common.service';
import { PersonsService } from 'src/persons/persons.service';
import { BooksModule } from 'src/books/books.module';

@Module({
  imports: [CommonModule, PersonsModule, BooksModule],
  providers: [AuthorsService, CommonService, PersonsService],
  controllers: [AuthorsController],
})
export class AuthorsModule {}
