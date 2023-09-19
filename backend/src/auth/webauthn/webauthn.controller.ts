import { Body, Controller, Get, Logger, Post, Request } from '@nestjs/common';
import { Public } from '../public.decorator';
import { ApiOperation } from '@nestjs/swagger';
import { ChallengeResponseDto } from './dto/challenge-response.dto';
import { WebauthnService } from './webauthn.service';
import { PublicKeyDto } from './dto/public-key.dto';
import { PublicKey } from './schemas/public-key.schema';

const logger = new Logger('WebauthnController');

@Controller('auth/webauthn')
export class WebauthnController {
  constructor(private webauthnService: WebauthnService) {}

  @Public()
  @Post('challenge')
  @ApiOperation({ description: 'Generate Web Authentication API challange' })
  generateChallenge(): ChallengeResponseDto {
    return { challenge: this.webauthnService.registerChallenge() };
  }

  @Get()
  @ApiOperation({ description: 'Get user public keys' })
  get(@Request() { user }): Promise<PublicKey[]> {
    return this.webauthnService.getUserKeys(user.id);
  }

  @Post('add')
  @ApiOperation({ description: 'Add public key' })
  add(@Body() data: PublicKeyDto, @Request() { user }) {
    this.webauthnService.add(data, user.id);
  }
}
