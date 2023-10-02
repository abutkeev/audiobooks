import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

class SeriesDto {
  @IsNotEmpty()
  @ApiProperty()
  id: string;

  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  author_id: string;
}

export default SeriesDto;
