import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNumber, Min } from 'class-validator';

export class UserPositionEntryDto {
  @ApiProperty({ required: true })
  readonly userId: string;

  @ApiProperty()
  readonly userLogin: string;

  @ApiProperty()
  readonly userName: string;

  @ApiProperty({ required: true })
  readonly instanceId: string;

  @IsInt()
  @Min(0)
  readonly currentChapter: number;

  @IsNumber()
  @Min(0)
  readonly position: number;

  @IsDateString()
  readonly updated: string;
}
