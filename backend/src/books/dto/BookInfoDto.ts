import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import CoverDto from './CoverDto';

class BookInfoDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  author_id: string;

  @IsNotEmpty()
  @ApiProperty()
  reader_id: string;

  @ApiProperty({ required: false })
  series_id?: string;

  @ApiProperty({ required: false })
  series_number?: string;

  @ApiProperty({ required: false })
  cover?: CoverDto;
}

export default BookInfoDto;
