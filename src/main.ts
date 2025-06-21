import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import { ApiKeyMiddleware } from './api-key.middleware';
require('dotenv').config();

fs.mkdir('certificates', { recursive: true }, (err) => {});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  // app.use(new ApiKeyMiddleware().use);
  await app.listen(process.env.PORT ?? 8909);
}
bootstrap();
