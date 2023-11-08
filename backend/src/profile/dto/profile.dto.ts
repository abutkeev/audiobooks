import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ProfileDto {
  @IsNotEmpty()
  readonly login: string;

  @ApiProperty()
  readonly name: string;
}
