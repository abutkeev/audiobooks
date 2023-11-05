import { Module } from '@nestjs/common';
import { SignUpService } from './sign-up.service';
import { SignUpController } from './sign-up.controller';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [UsersModule, AuthModule, HttpModule],
  providers: [SignUpService],
  controllers: [SignUpController],
})
export class SignUpModule {}
