import { ApiProperty } from '@nestjs/swagger';
import { PositionDto } from './position.dto';

class Friend {
  @ApiProperty()
  uid: string;

  @ApiProperty()
  login: string;

  @ApiProperty()
  name: string;
}

export class FriendPositionsDto {
  @ApiProperty()
  readonly friend: Friend;

  @ApiProperty()
  readonly positions: PositionDto[];
}
