import { IsNotEmpty } from 'class-validator';

export class AddFriendRequestDto {
  @IsNotEmpty()
  readonly login: string;
}
