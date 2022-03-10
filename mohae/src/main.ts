import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';
<<<<<<< HEAD
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const serverConfig = config.get('server');
  const port = serverConfig.port;
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
=======
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const serverConfig = config.get('server');
  const port = serverConfig.port;

  const app = await NestFactory.create(AppModule);
>>>>>>> cb50d5df1c24fb0d5587411120777e2bdcffab98
  await app.listen(port);
  Logger.log(`Start Run ${port}`);
}
bootstrap();
