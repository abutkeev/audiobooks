import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Public } from 'src/auth/public.decorator';
import { SignUpDto } from './dto/sign-up.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { SignUpService } from './sign-up.service';
import { LoginResponseDto } from 'src/auth/dto/login-response.dto';

@Controller('sign-up')
@ApiTags('sign-up')
export class SignUpController {
  constructor(private signUpService: SignUpService) {}

  @Public()
  @Post()
  @ApiCreatedResponse({ description: 'sign up success', type: LoginResponseDto })
  @ApiBadRequestResponse({ description: 'sign up error' })
  signUp(@Body() user: SignUpDto): Promise<LoginResponseDto> {
    return this.signUpService.signUp(user);
  }

  @Public()
  @Get('check/:login')
  check(@Param('login') login: string): Promise<boolean> {
    return this.signUpService.check(login);
  }
}
