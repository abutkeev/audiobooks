import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import path from 'path';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('main');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(path.resolve(__dirname, '..', 'frontend'));
  app.useStaticAssets(path.resolve(__dirname, '..', 'data'), { prefix: '/api/' });
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');

  const PORT = process.env.PORT || 4000;
  await app.listen(PORT, () => logger.log(`Server started on PORT ${PORT}`));
}
bootstrap();
