import { ApiProperty } from '@nestjs/swagger';

export class AuthenticationDto {
  @ApiProperty()
  credentialId: string;

  @ApiProperty()
  authenticatorData: string;

  @ApiProperty()
  clientData: string;

  @ApiProperty()
  signature: string;
}
