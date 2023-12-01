import { ApiProperty } from '@nestjs/swagger';
import ChapterDto from './ChapterDto';
import OldBookInfoDto from './OldBookInfoDto';

class OldBookDto {
  @ApiProperty()
  info: OldBookInfoDto;

  @ApiProperty({ type: [ChapterDto] })
  chapters: ChapterDto[];
}

export default OldBookDto;
