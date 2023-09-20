import { Module, forwardRef } from '@nestjs/common';
import { WebauthnController } from './webauthn.controller';
import { WebauthnService } from './webauthn.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PublicKey, PublicKeySchema } from './schemas/public-key.schema';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from '../auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PublicKey.name, schema: PublicKeySchema }]),
    UsersModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [WebauthnController],
  providers: [WebauthnService, UsersService],
})
export class WebauthnModule {}
