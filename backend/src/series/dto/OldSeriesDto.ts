import { IsNotEmpty, IsString } from 'class-validator';

class SeriesDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  author_id: string;
}

export default SeriesDto;
