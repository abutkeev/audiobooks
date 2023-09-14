import { IsNotEmpty } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  readonly id: string;

  @IsNotEmpty()
  readonly login: string;
}
