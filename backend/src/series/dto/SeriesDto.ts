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
  authors: string[];
}

export default SeriesDto;
