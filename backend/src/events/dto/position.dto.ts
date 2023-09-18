import { IsDateString, IsInt, IsNotEmpty, Min } from 'class-validator';

export class PositionDto {
  @IsNotEmpty()
  readonly bookId: string;

  @IsInt()
  @Min(0)
  readonly currentChapter: number;

  @IsInt()
  @Min(0)
  readonly position: number;

  @IsDateString()
  readonly updated: string;
}
