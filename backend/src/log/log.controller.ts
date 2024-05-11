import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { Public } from 'src/auth/public.decorator';

const logger = new Logger('Log');

@Controller('log')
export class LogController {
  @Public()
  @Post()
  @ApiBody({ type: Object })
  write(@Body() data: unknown) {
    logger.log(data);
  }
}
