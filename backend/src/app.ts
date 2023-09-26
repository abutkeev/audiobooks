import { ValidationPipe, INestApplication, NestApplicationOptions } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import path from 'path';
import { AppModule } from './app.module';
import { DataDir, FrontendDir } from './constants';

export async function setup(options?: NestApplicationOptions) {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, options);
  app.useStaticAssets(FrontendDir);
  app.useStaticAssets(DataDir, { prefix: '/api/' });
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');

  SwaggerModule.setup('api-docs', app, getOpenAPIDocument(app));

  return app;
}

const capitalizeFirst = (input: string) => {
  const first = input.charAt(0).toUpperCase();
  const other = input.slice(1);
  return `${first}${other}`;
};

export function getOpenAPIDocument(app: INestApplication) {
  const config = new DocumentBuilder().setTitle('Audiobooks').setVersion('1.0').build();

  const doc = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: true,
    operationIdFactory: (controller, method) => {
      return `${controller.replace('Controller', '')}${capitalizeFirst(method)}`;
    },
  });
  doc.security = [{ bearerAuth: [] }];
  doc.components.securitySchemes = { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } };
  doc.servers = [{ url: '/api/', description: 'local' }];
  return doc;
}
