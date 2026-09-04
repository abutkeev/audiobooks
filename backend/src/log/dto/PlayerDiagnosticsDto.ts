import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, IsArray, IsInt, IsString, MaxLength } from 'class-validator';

class PlayerDiagnosticsDto {
  @IsString()
  @MaxLength(64)
  @ApiProperty()
  instance: string;

  @IsInt()
  @ApiProperty()
  seq: number;

  @IsString()
  @MaxLength(64)
  @ApiProperty()
  version: string;

  @IsString()
  @MaxLength(512)
  @ApiProperty()
  userAgent: string;

  // entries carry whatever the recorded event had, so their shape stays open on purpose
  @IsArray()
  @ArrayMaxSize(1000)
  @ApiProperty({ type: [Object] })
  entries: Record<string, unknown>[];
}

export default PlayerDiagnosticsDto;
