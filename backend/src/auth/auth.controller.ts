import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local/local-auth.guard';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { ApiBody, ApiCreatedResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { LoginBodyDto } from './dto/login-body.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  @ApiOperation({ description: 'Authorize user by login and password' })
  @ApiBody({
    type: LoginBodyDto,
  })
  @ApiCreatedResponse({ description: 'authorization success', type: LoginResponseDto })
  @ApiUnauthorizedResponse({ description: 'authorization failed' })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
