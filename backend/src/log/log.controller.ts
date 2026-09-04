import {
  BadRequestException,
  Body,
  Controller,
  Logger,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Public } from 'src/auth/public.decorator';
import LogDto from './dto/LogDto';

const logger = new Logger('Log');

// public and unauthenticated by design, see docs/ai/backend/modules/other.md
@Controller('log')
@UseGuards(ThrottlerGuard)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class LogController {
  @Public()
  @Post()
  write(@Body() data: LogDto) {
    if (!data?.telegramLogin && !data?.apiError && !data?.playerDiagnostics) {
      throw new BadRequestException('empty log entry');
    }

    logger.log(data);
  }
}
