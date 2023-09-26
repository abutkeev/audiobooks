import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

class PersonDto {
  @IsNotEmpty()
  @ApiProperty()
  id: string;

  @IsNotEmpty()
  @ApiProperty()
  name: string;
}

export default PersonDto;
