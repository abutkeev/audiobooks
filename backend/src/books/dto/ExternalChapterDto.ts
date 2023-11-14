import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

class ExternalChapterDto {
  @IsNotEmpty()
  @ApiProperty({ required: true })
  title: string;

  @IsNotEmpty()
  @ApiProperty({ required: true })
  url: string;
}

export default ExternalChapterDto;
