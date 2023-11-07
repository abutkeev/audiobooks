import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

class TelegramDataDto {
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
}

export class TelegramAccountDto {
  @ApiProperty()
  info?: TelegramDataDto;
}
