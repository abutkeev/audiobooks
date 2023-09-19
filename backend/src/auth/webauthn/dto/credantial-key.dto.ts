import { ApiProperty } from '@nestjs/swagger';

export class CredentialKeyDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  publicKey: string;

  @ApiProperty({ type: 'string', enum: ['RS256', 'ES256'] })
  algorithm: 'RS256' | 'ES256';
}
