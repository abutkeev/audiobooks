import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { Public } from '../public.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChallengeResponseDto } from './dto/challenge-response.dto';
import { WebauthnService } from './webauthn.service';
import { PublicKeyDto } from './dto/public-key.dto';
import { PublicKey } from './schemas/public-key.schema';
import { AuthenticationDto } from './dto/authentication.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { AllowInactive } from '../allow-inactive.decorator';

@AllowInactive()
@ApiTags('webauthn')
@Controller('auth/webauthn')
export class WebauthnController {
  constructor(private webauthnService: WebauthnService) {}

  @Public()
  @Post('challenge')
  @ApiOperation({ description: 'Generate Web Authentication API challange' })
  generateChallenge(): ChallengeResponseDto {
    return { challenge: this.webauthnService.registerChallenge() };
  }

  @Public()
  @Post('login')
  @ApiOperation({ description: 'Authorize user by security key' })
  async login(@Body() data: AuthenticationDto): Promise<LoginResponseDto> {
    return await this.webauthnService.auth(data);
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
