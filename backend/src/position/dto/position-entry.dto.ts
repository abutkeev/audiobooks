import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, Min } from 'class-validator';

export class PositionEntryDto {
  @ApiProperty()
  readonly instanceId: string;

  @IsInt()
  @Min(0)
  readonly currentChapter: number;

  @IsInt()
  @Min(0)
  readonly position: number;

  @IsDateString()
  readonly updated: string;
}
