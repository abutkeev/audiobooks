import { ApiProperty } from '@nestjs/swagger';

export class LoginBodyDto {
  @ApiProperty({ example: 'test' })
  readonly login: string;

  @ApiProperty({ example: 'guessme' })
  readonly password: string;
}
