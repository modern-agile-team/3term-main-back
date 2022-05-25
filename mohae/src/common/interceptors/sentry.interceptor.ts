import {
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import { catchError } from 'rxjs/operators';
import { IncomingWebhook } from '@slack/client';
// import slackConfig from '../config/slack.config';
import { of } from 'rxjs';
import * as Sentry from '@sentry/minimal';
import * as config from 'config';

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      catchError((error) => {
        if (error.status / 100 !== 5) {
          const { response } = error;
          return of(response);
        }

        Sentry.captureException(error);
        const { SENTRY_DSN } = config.get('sentry');
        const webhook = new IncomingWebhook(SENTRY_DSN);

        webhook.send({
          attachments: [
            {
              color: 'danger',
              text: '🚨Mohae Back-End 버그 발생🚨',
              fields: [
                {
                  title: `Request Message: ${error.message}`,
                  value: error.stack,
                  short: false,
                },
              ],
              ts: Math.floor(new Date().getTime() / 1000).toString(),
            },
          ],
        });
        return of({
          statusCode: 500,
          msg: error.message,
          err: error.name,
        });
      }),
    );
  }
}
