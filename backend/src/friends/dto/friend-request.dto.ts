import { ApiProperty } from '@nestjs/swagger';

export class FriendRequestDto {
  @ApiProperty({ required: true })
  readonly id: string;

  @ApiProperty({ required: true })
  readonly uid: string;

  @ApiProperty()
  readonly login: string | undefined;

  @ApiProperty()
  readonly name: string | undefined;
}
