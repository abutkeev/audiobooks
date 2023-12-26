import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

class ExternalChapterDto {
  @IsNotEmpty()
  @ApiProperty({ required: true })
  title: string;

  @IsNotEmpty()
  @ApiProperty({ required: true })
  url: string;

  @IsNotEmpty()
  @ApiProperty({ required: true })
  bookUrl: string;
}

export default ExternalChapterDto;
