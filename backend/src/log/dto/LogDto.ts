import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import PlayerDiagnosticsDto from './PlayerDiagnosticsDto';

class LogDto {
  @IsOptional()
  @IsObject()
  @ApiPropertyOptional({ type: Object })
  telegramLogin?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  @ApiPropertyOptional({ type: Object })
  apiError?: Record<string, unknown>;

  @IsOptional()
  @ValidateNested()
  @Type(() => PlayerDiagnosticsDto)
  @ApiPropertyOptional({ type: PlayerDiagnosticsDto })
  playerDiagnostics?: PlayerDiagnosticsDto;
}

export default LogDto;
