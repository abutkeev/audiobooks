import { ApiProperty } from '@nestjs/swagger';
import { RegistrationDto } from './registration.dto';

export class PublicKeyDto {
  @ApiProperty()
  name: string;

  registration: RegistrationDto;
}
