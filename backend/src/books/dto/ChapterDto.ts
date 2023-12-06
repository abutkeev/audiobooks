import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

class ChapterDto {
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @ApiProperty()
  filename: string;

  @ApiProperty({ required: false, description: 'Duration in seconds' })
  duration?: number;
}

export default ChapterDto;
