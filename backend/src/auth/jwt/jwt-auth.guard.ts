import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../public.decorator';
import { INACTIVE_ALLOWED_KEY } from '../allow-inactive.decorator';

const logger = new Logger('JwtAuthGuard');

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const canActivate = await super.canActivate(context);

    const inactiveAllowed = this.reflector.getAllAndOverride<boolean>(INACTIVE_ALLOWED_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const { user } = super.getRequest(context);
    if (!user.enabled && !inactiveAllowed) {
      return false;
    }

    if (typeof canActivate === 'boolean') return canActivate;

    logger.error('canActivate returned unsupported value');
    return false;
  }
}
