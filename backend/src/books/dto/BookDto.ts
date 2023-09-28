import { ApiProperty } from '@nestjs/swagger';
import BookInfoDto from './BookInfoDto';
import ChapterDto from './ChapterDto';

class BookDto {
  @ApiProperty()
  info: BookInfoDto;

  @ApiProperty({ type: [ChapterDto] })
  chapters: ChapterDto[];
}

export default BookDto;
