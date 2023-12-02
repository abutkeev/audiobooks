import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { CommonModule } from 'src/common/common.module';
import { CommonService } from 'src/common/common.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [CommonModule, HttpModule],
  providers: [BooksService, CommonService],
  controllers: [BooksController],
  exports: [BooksService],
})
export class BooksModule {}
