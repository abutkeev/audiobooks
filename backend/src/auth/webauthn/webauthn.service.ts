import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomBytes } from 'crypto';
import { Model } from 'mongoose';
import { PublicKey } from './schemas/public-key.schema';
import { PublicKeyDto } from './dto/public-key.dto';
import { type server } from '@passwordless-id/webauthn';

// NestJS is not supporting ESM import
const webauthn: Promise<typeof server> = eval(`import('@passwordless-id/webauthn')`).then(result => result.server);

const logger = new Logger('WebauthnService');

@Injectable()
export class WebauthnService {
  private challenges: string[] = [];

  constructor(@InjectModel(PublicKey.name) private publicKeyModel: Model<PublicKey>) {}

  registerChallenge() {
    const challenge = randomBytes(32).toString('base64url');
    this.challenges.push(challenge);
    return challenge;
  }

  getUserKeys(userId: string) {
    return this.publicKeyModel.find({ userId });
  }

  async add({ registration, name }: PublicKeyDto, userId: string) {
    try {
      // NestJS is not supporting ESM import
      const { verifyRegistration } = await webauthn;
      const { credential } = await verifyRegistration(registration, {
        challenge: (challenge: string) => {
          if (!this.challenges.includes(challenge)) {
            logger.error(`challenge ${challenge} is not registred`);
            return false;
          }
          this.challenges = this.challenges.filter(entry => entry !== challenge);
          return true;
        },
        // don't verify origin
        origin: () => true,
      });
      this.publicKeyModel.create({ ...credential, name, userId });
    } catch (e) {
      logger.error(e);
      throw new BadRequestException('add key failed');
    }
  }
}
