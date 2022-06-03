import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './common/utils/swagger';
import * as expressBasicAuth from 'express-basic-auth';
import { SentryInterceptor } from './common/interceptors/sentry.interceptor';
import { ConfigService } from '@nestjs/config';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestApplication>(AppModule);
  const configService = app.get(ConfigService);
  const serverPort = configService.get('SERVER_PORT');
  const swaggerUser = configService.get('SWAGGER_USER');
  const swaggerPassword = configService.get('SWAGGER_PASSWORD');

  // Cors 적용
  // app.enableCors();

  app.use(
    ['/mohae-api-docs'],
    expressBasicAuth({
      challenge: true,
      users: {
        [swaggerUser]: swaggerPassword,
      },
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new SentryInterceptor());

  //Swagger 환경설정 연결
  setupSwagger(app);

  await app.listen(serverPort);

  Logger.log(`Start Run: ${serverPort}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => {
      app.close();
    });
  }
}
bootstrap();
