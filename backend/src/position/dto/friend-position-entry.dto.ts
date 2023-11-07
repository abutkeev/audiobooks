import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNumber, Min } from 'class-validator';

export class FriendPositionEntryDto {
  @ApiProperty({ required: true })
  readonly friendId: string;

  @ApiProperty()
  readonly friendLogin: string;

  @ApiProperty()
  readonly friendName: string;

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
