import { Module } from '@nestjs/common';
import { WebauthnController } from './webauthn.controller';
import { WebauthnService } from './webauthn.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PublicKey, PublicKeySchema } from './schemas/public-key.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: PublicKey.name, schema: PublicKeySchema }])],
  controllers: [WebauthnController],
  providers: [WebauthnService]
})
export class WebauthnModule {}
