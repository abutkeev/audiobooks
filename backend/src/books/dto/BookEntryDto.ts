import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import BookInfoDto from './BookInfoDto';

class BookEntryDto {
  @IsNotEmpty()
  @ApiProperty()
  id: string;

  @ApiProperty()
  info: BookInfoDto;
}

export default BookEntryDto;
