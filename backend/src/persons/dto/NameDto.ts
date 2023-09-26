import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

class NameDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;
}

export default NameDto;
