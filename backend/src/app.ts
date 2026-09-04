import { ValidationPipe, INestApplication, NestApplicationOptions } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { DataDir, FrontendDir } from './constants';
import path from 'path';
import { json, urlencoded } from 'express';

// the batch travels through sendBeacon, which caps the body on its own side too
const logBodyLimit = '64kb';

export async function setup(options?: NestApplicationOptions) {
  // parsers are registered here rather than by nest: a route scoped one mounted afterwards
  // would silently take the place of the built in one and leave every other route unparsed
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { ...options, bodyParser: false });
  // both static handlers are mounted before the nest router, so a directory whose path matches
  // a route (data/books/<id> against GET /books/:id) would answer 301 instead of the controller
  app.useStaticAssets(FrontendDir, { redirect: false });
  app.useStaticAssets(path.resolve(DataDir, 'books'), { prefix: '/api/books/', index: false, redirect: false });
  // before the global parser: whichever runs first is the one whose limit applies
  app.use('/api/log', json({ limit: logBodyLimit }));
  app.use(json());
  app.use(urlencoded({ extended: true }));
  // the throttler keys on the address, and behind a reverse proxy that is the proxy itself:
  // the loopback covers nginx on the host, the private ranges cover the docker gateway, see deploy/
  app.set('trust proxy', ['loopback', 'uniquelocal']);
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
