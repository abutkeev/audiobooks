import { PipeTransform, Injectable, Logger } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Socket } from 'socket.io';
import { UserDto } from 'src/users/dto/user.dto';

export type SocketWithUser = Socket & { user?: UserDto; instanceId?: string };

const logger = new Logger('AuthValidationPipe');

@Injectable()
export class EventsAuthValidationPipe implements PipeTransform {
  async transform(value: any) {
    try {
      if (value instanceof Socket) {
        if (!('user' in value) || !('instanceId' in value)) {
          throw new WsException('No user or instance id for socket');
        }

        if (typeof value.instanceId !== 'string') {
          throw new WsException('Instance id is not string');
        }

        const errors = await validate(plainToInstance(UserDto, value.user));
        if (errors.length > 0) {
          for (const error of errors) {
            logger.error(error);
          }
          throw new WsException('User validation failed');
        }
        return value as SocketWithUser;
      }
      return value;
    } catch (e) {
      if (e instanceof Error) {
        logger.error(e.message);
      }
      throw e;
    }
  }
}
