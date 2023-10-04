import { Module, forwardRef } from '@nestjs/common';
import { WebauthnController } from './webauthn.controller';
import { WebauthnService } from './webauthn.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PublicKey, PublicKeySchema } from './schemas/public-key.schema';
import { AuthModule } from '../auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PublicKey.name, schema: PublicKeySchema }]),
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [WebauthnController],
  providers: [WebauthnService],
})
export class WebauthnModule {}
