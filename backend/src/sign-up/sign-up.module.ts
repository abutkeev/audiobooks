import { Module } from '@nestjs/common';
import { SignUpService } from './sign-up.service';
import { SignUpController } from './sign-up.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  providers: [SignUpService],
  controllers: [SignUpController],
})
export class SignUpModule {}
