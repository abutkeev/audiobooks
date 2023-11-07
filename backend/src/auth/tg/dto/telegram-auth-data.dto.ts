import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class TelegramAuthDataDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  id: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  first_name: string;

  @ApiProperty()
  last_name?: string;

  @ApiProperty()
  username?: string;

  @ApiProperty()
  photo_url?: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  auth_date: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  hash: string;
}
