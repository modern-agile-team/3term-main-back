import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './common/utils/swagger';
import * as expressBasicAuth from 'express-basic-auth';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import { ClientErrorInterceptor } from './common/interceptors/client-error.interceptor';
import helmet from 'helmet';
import { AccessGuard } from './common/guards/access.guard';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestApplication>(AppModule);
  const configService = app.get(ConfigService);
  const serverPort = configService.get('SERVER_PORT');
  const swaggerUser = configService.get('SWAGGER_USER');
  const swaggerPassword = configService.get('SWAGGER_PASSWORD');
  const winstonLogger = app.get(WINSTON_MODULE_NEST_PROVIDER);

  // Cors 적용
  app.enableCors();

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

  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    }),
  );
  // app.useGlobalGuards(new AccessGuard());
  app.useGlobalInterceptors(new ClientErrorInterceptor(winstonLogger));
  app.useGlobalFilters(new HttpExceptionFilter(winstonLogger));

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
