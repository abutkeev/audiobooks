import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local/local.strategy';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt/jwt.strategy';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { WebauthnModule } from './webauthn/webauthn.module';
import { AdminAuthGuard } from './jwt/admin-auth.guard';
import { JWT_SECRET } from 'src/constants';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule,
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    WebauthnModule,
  ],
  controllers: [AuthController],
  providers: [
    LocalStrategy,
    AuthService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AdminAuthGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
