import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  readonly login: string;

  @IsNotEmpty()
  readonly password: string;

  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly enabled: boolean;

  @ApiProperty()
  readonly admin: boolean;
}
