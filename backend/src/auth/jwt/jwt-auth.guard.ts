import { ExecutionContext, Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../public.decorator';
import { INACTIVE_ALLOWED_KEY } from '../allow-inactive.decorator';
import { UsersService } from 'src/users/users.service';
import { HAS_ONLINE_TAG } from '../has-online-tag.decorator';

const logger = new Logger('JwtAuthGuard');

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,

    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    try {
      const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      if (isPublic) {
        return true;
      }

      if (context.getType<string>() === 'telegraf') {
        return true;
      }

      const canActivate = await super.canActivate(context);

      const { user } = super.getRequest(context);
      if (user) {
        const hasOnlineTag = this.reflector.getAllAndOverride<boolean>(HAS_ONLINE_TAG, [
          context.getHandler(),
          context.getClass(),
        ]);

        if (!hasOnlineTag) {
          this.usersService.updateOnline(user.id);
        }

        const inactiveAllowed = this.reflector.getAllAndOverride<boolean>(INACTIVE_ALLOWED_KEY, [
          context.getHandler(),
          context.getClass(),
        ]);
        if (!user.enabled && !inactiveAllowed) {
          return false;
        }
      }

      if (typeof canActivate === 'boolean') return canActivate;

      logger.error('canActivate returned unsupported value');
      return false;
    } catch (e) {
      logger.error('got exception in jwt auth guard', e, context.getType());
      return false;
    }
  }
}
