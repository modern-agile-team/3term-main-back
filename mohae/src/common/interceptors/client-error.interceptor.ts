import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, map } from 'rxjs/operators';
import { IncomingWebhook } from '@slack/client';
// import slackConfig from '../config/slack.config';
import { of } from 'rxjs';
import { WinstonLogger, WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class ClientErrorInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: WinstonLogger,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const status = context.switchToHttp().getResponse().statusCode;

    return next.handle().pipe(
      map(({ statusCode, msg, response }) => {
        const successData = {
          success: true,
          date: new Date().toLocaleString(),
          statusCode: statusCode || status,
          msg,
          response,
        };

        this.logger.verbose(
          'successData',
          `${successData.date}, ${successData.msg}`,
        );

        return successData;
      }),
    );
  }
}
