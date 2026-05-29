import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateBookmarkDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly bookId: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  readonly currentChapter: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  readonly position: number;
}
