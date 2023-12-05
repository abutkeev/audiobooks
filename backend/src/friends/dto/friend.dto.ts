import { ApiProperty } from '@nestjs/swagger';

export class FriendDto {
  @ApiProperty({ required: true })
  readonly id: string;

  @ApiProperty({ required: true })
  readonly uid: string;

  @ApiProperty()
  readonly login: string | undefined;

  @ApiProperty()
  readonly name: string | undefined;

  @ApiProperty({ required: false })
  readonly online?: string;
}
