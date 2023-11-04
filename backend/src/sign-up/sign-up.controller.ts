import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Public } from 'src/auth/public.decorator';
import { SignUpDto } from './dto/sign-up.dto';
import { ApiTags } from '@nestjs/swagger';
import { SignUpService } from './sign-up.service';

@Controller('sign-up')
@ApiTags('sign-up')
export class SignUpController {
  constructor(private signUpService: SignUpService) {}

  @Public()
  @Post()
  signUp(@Body() user: SignUpDto) {
    return this.signUpService.signUp(user);
  }

  @Public()
  @Get('check/:login')
  check(@Param('login') login: string): Promise<boolean> {
    return this.signUpService.check(login);
  }
}
