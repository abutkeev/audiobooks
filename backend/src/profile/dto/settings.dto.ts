import { ApiProperty } from '@nestjs/swagger';

export class SettingsDto {
  @ApiProperty({ required: false })
  readonly language?: string;

  @ApiProperty({ required: false })
  readonly theme?: string;
}
