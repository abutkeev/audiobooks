import { ApiProperty } from '@nestjs/swagger';

export class BookmarkDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly bookId: string;

  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly currentChapter: number;

  @ApiProperty()
  readonly position: number;

  @ApiProperty()
  readonly updated: string;
}
