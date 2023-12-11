import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

class ChapterEditDto {
  @IsNotEmpty()
  @ApiProperty()
  title: string;
}

export default ChapterEditDto;
