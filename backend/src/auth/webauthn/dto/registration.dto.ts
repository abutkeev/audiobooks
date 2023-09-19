import { ApiProperty } from '@nestjs/swagger';
import { CredentialKeyDto } from './credantial-key.dto';

export class RegistrationDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  authenticatorData: string;

  @ApiProperty()
  clientData: string;

  @ApiProperty()
  attestationData?: string;

  credential: CredentialKeyDto;

}
