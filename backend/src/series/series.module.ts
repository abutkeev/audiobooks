import { Module } from '@nestjs/common';
import { SeriesService } from './series.service';
import { SeriesController } from './series.controller';
import { CommonModule } from 'src/common/common.module';
import { CommonService } from 'src/common/common.service';
import { BooksModule } from 'src/books/books.module';

@Module({
  imports: [CommonModule, BooksModule],
  providers: [SeriesService, CommonService],
  controllers: [SeriesController],
})
export class SeriesModule {}
