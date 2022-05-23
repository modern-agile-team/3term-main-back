import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './common/utils/swagger';
import * as expressBasicAuth from 'express-basic-auth';
import * as Sentry from '@sentry/node';
import { SentryInterceptor } from './common/interceptors/sentry.interceptor';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const serverConfig = config.get('server');
  const port = serverConfig.port;
  const { SWAGGER_USER, SWAGGER_PASSWORD } = config.get('swagger');
  // Cors 적용
  // app.enableCors();

  app.useGlobalInterceptors(new SentryInterceptor());
  app.use(
    ['/mohae-api-docs'],
    expressBasicAuth({
      challenge: true,
      users: {
        [SWAGGER_USER]: SWAGGER_PASSWORD,
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

  //Swagger 환경설정 연결
  setupSwagger(app);

  await app.listen(port);

  Logger.log(`Start Run: ${port}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => {
      app.close();
    });
  }
}
bootstrap();
