import { Controller, NotFoundException, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local/local-auth.guard';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { ApiBody, ApiCreatedResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { LoginBodyDto } from './dto/login-body.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

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

  @Post('token')
  @ApiOperation({ description: 'Generate new authorization token' })
  async generateToken(@Request() { user: { id } }): Promise<LoginResponseDto> {
    const user = await this.usersService.find(id);
    if (!user) {
      throw new NotFoundException(`user ${id} not found`);
    }
    return this.authService.login(user);
  }
}
