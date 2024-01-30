import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import CoverDto from './CoverDto';
import SeriesInfoDto from './SeriesInfoDto';

class BookInfoDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  authors: string[];

  @IsNotEmpty()
  @ApiProperty()
  readers: string[];

  @ApiProperty({
    type: 'array',
    items: { type: 'object', properties: { id: { type: 'string' }, number: { type: 'string' } }, required: ['id'] },
  })
  series: SeriesInfoDto[];

  @ApiProperty({ required: false })
  cover?: CoverDto;

  @ApiProperty({ required: false })
  draft?: boolean;
}

export default BookInfoDto;
