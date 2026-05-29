import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateBookmarkDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly name: string;
}
