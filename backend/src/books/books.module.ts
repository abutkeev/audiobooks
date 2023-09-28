import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { CommonModule } from 'src/common/common.module';
import { CommonService } from 'src/common/common.service';

@Module({
  imports: [CommonModule],
  providers: [BooksService, CommonService],
  controllers: [BooksController],
})
export class BooksModule {}
