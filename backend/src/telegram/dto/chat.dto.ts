import { ApiProperty } from '@nestjs/swagger';

export class ChatDto {
  @ApiProperty({ required: true })
  id: number;

  @ApiProperty({ required: true })
  type: string;

  @ApiProperty({ required: true })
  title: string;

  @ApiProperty({ required: true })
  status: string;

  @ApiProperty({ required: true })
  authorized: boolean;
}
