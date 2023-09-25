import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  readonly login: string;

  @ApiProperty({ required: false })
  readonly password: string;

  @ApiProperty({ required: false })
  readonly name: string;
}
