import { BadRequestException, Inject, Injectable, Logger, UnauthorizedException, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomBytes } from 'crypto';
import { Model } from 'mongoose';
import { PublicKey } from './schemas/public-key.schema';
import { PublicKeyDto } from './dto/public-key.dto';
import { AuthenticationDto } from './dto/authentication.dto';
import { server } from '@abutkeev/webauthn';
import { UsersService } from 'src/users/users.service';
import { AuthService } from '../auth.service';

const logger = new Logger('WebauthnService');

@Injectable()
export class WebauthnService {
  private challenges: string[] = [];

  private verifyChallenge = (challenge: string) => {
    if (!this.challenges.includes(challenge)) {
      logger.error(`challenge ${challenge} is not registred`);
      return false;
    }
    this.challenges = this.challenges.filter(entry => entry !== challenge);
    return true;
  };

  private verifyOrigin = () => {
    // TODO: add origin verification
    return true;
  };

  constructor(
    @InjectModel(PublicKey.name) private publicKeyModel: Model<PublicKey>,

    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,

    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService
  ) {}

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
      const { credential } = await server.verifyRegistration(registration, {
        challenge: this.verifyChallenge,
        origin: this.verifyOrigin,
      });
      this.publicKeyModel.create({ ...credential, name, userId });
    } catch (e) {
      logger.error(e);
      throw new BadRequestException('add key failed');
    }
  }

  async remove({ id, userId }: { id: string; userId: string }): Promise<true> {
    await this.publicKeyModel.deleteOne({ id, userId });
    return true;
  }

  async auth(authentication: AuthenticationDto) {
    try {
      const key = await this.publicKeyModel.findOne({ id: authentication.credentialId }).exec();
      if (!key) {
        throw new UnauthorizedException(`key ${authentication.credentialId} not found`);
      }
      const { id, publicKey, algorithm, userId } = key;
      if (algorithm !== 'RS256' && algorithm !== 'ES256') {
        throw new UnauthorizedException(`key ${authentication.credentialId} algorithm ${algorithm} is not supported`);
      }
      const result = await server.verifyAuthentication(
        authentication,
        { id, publicKey, algorithm },
        {
          challenge: this.verifyChallenge,
          origin: this.verifyOrigin,
          userVerified: true,
          counter: -1,
        }
      );
      if (!result) {
        throw new UnauthorizedException('verification failed');
      }
      const user = await this.usersService.find(userId);
      return this.authService.login(user);
    } catch (e) {
      logger.error(e);
      throw new UnauthorizedException('authorization failed');
    }
  }
}
