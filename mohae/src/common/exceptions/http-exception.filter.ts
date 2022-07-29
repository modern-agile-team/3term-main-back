import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Inject,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { WinstonLogger, WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { IncomingWebhook } from '@slack/client';
// import slackConfig from '../config/slack.config';
import * as Sentry from '@sentry/minimal';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { ErrorMsg, ErrorObj } from './error.interface';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: WinstonLogger,
  ) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();
    const request: Request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const error =
      exception instanceof HttpException
        ? (exception.getResponse() as ErrorObj)
        : {
            error: `${exception}`,
            statusCode: 500,
            message: `${request.url} 요청을 처리하는 도중 발생한 알 수 없는 서버에러입니다.`,
          };
    const errorMsg: ErrorMsg = {
      success: false,
      timestamp: new Date().toLocaleString(),
      path: request.url,
      error,
    };

    if (status / 100 !== 5) {
      this.logger.warn(errorMsg, '클라이언트 요청 에러');

      return response.status(status).json(errorMsg);
    }

    Sentry.captureException(error);

    const sentryDsn = process.env.SENTRY_DSN;
    const webhook = new IncomingWebhook(sentryDsn);
    const sentryConfig = {
      attachments: [
        {
          color: 'danger',
          text: '🚨Mohae Back-End 버그 발생🚨',
          fields: [
            {
              title: `Request Message: ${error.message}`,
              value: `Code: ${error.statusCode}, ${error.error} ${exception.stack}`,
              short: false,
            },
          ],
          ts: Math.floor(new Date().getTime() / 1000).toString(),
        },
      ],
    };

    webhook.send(sentryConfig);

    this.logger.error(exception.stack, '알 수 없는 서버 에러입니다.');

    return response.status(status).json(errorMsg);
  }
}
