import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  readonly id: string;

  @IsNotEmpty()
  readonly login: string;

  @ApiProperty()
  readonly name: string;

  @ApiProperty({ required: false })
  readonly enabled: boolean;

  @ApiProperty({ required: false })
  readonly admin: boolean;
}
