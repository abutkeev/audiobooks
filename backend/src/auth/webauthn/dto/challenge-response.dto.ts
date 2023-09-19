import { ApiProperty } from '@nestjs/swagger';

export class ChallengeResponseDto {
  @ApiProperty({description: 'A server-side randomly generated nonce, base64url encoded'})
  readonly challenge: string;
}
