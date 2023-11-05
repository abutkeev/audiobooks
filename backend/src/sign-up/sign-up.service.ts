import { BadRequestException, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';
import { HttpService } from '@nestjs/axios';
import { RECAPTCHA_SITE_KEY, RECAPTCHA_VERIFY_URL } from 'src/constants';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SignUpService {
  constructor(
    private readonly httpService: HttpService,
    private usersService: UsersService,
    private authService: AuthService
  ) {}

  async signUp({ login, password, name, captchaToken }: SignUpDto) {
    const otherId = await this.usersService.findIdByLogin(login);
    if (otherId) {
      throw new BadRequestException(`login ${login} is already used`);
    }

    if (!this.checkCaptcha(captchaToken)) {
      throw new BadRequestException('captcha verification failed');
    }

    const uid = await this.usersService.create({ login, password, name, admin: false, enabled: false });
    const user = await this.usersService.find(uid);
    return this.authService.login(user);
  }

  async check(login: string) {
    return !(await this.usersService.findIdByLogin(login));
  }

  async checkCaptcha(token: string) {
    if (!RECAPTCHA_SITE_KEY || !RECAPTCHA_VERIFY_URL) {
      throw new BadRequestException('captcha verification is not configured');
    }

    if (!token) {
      throw new BadRequestException('captcha token is empty');
    }

    try {
      const { data } = await firstValueFrom(
        this.httpService.post(RECAPTCHA_VERIFY_URL, { siteKey: RECAPTCHA_SITE_KEY, token })
      );
      if (
        !data ||
        typeof data !== 'object' ||
        !('tokenProperties' in data) ||
        data.tokenProperties ||
        typeof data.tokenProperties !== 'object'
      ) {
        return false;
      }

      return !!data.tokenProperties?.valid;
    } catch {
      return false;
    }
  }
}
