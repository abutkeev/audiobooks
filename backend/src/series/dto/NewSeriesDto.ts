import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

class NewSeriesDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @ApiProperty({ oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] })
  author_id: string | string[];
}

export default NewSeriesDto;
