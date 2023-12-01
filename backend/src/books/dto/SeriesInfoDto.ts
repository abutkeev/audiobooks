import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

class SeriesInfoDto {
  @IsNotEmpty()
  @ApiProperty()
  id: string;

  @ApiProperty({ required: false })
  number?: string;
}

export default SeriesInfoDto;
