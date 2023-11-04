import { IsNotEmpty } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  readonly login: string;

  @IsNotEmpty()
  readonly password: string;

  @IsNotEmpty()
  readonly name: string;
}
