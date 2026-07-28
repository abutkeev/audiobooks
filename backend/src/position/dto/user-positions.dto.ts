import { ApiProperty } from '@nestjs/swagger';
import { PositionDto } from './position.dto';

export class UserPositionsDto {
  @ApiProperty()
  readonly userId: string;

  @ApiProperty()
  readonly positions: PositionDto[];
}
