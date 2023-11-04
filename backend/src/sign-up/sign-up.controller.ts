import { Body, Controller, Post } from '@nestjs/common';
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
}
