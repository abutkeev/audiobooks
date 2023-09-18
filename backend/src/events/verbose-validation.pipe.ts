import { Logger, ValidationPipe } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

const logger = new Logger('Verbose validation pipe instance');

export const verboseValidationPipeInstance = new ValidationPipe({
  exceptionFactory: errors => {
    if (errors.length > 0) {
      for (const error of errors) {
        logger.error(error);
      }
      throw new WsException('validation failed');
    }
  },
});
