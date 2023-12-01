import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

class NewSeriesDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  authors: string[];
}

export default NewSeriesDto;
