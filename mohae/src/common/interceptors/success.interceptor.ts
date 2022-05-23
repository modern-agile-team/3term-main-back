import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class SuccesseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('...');

    return next.handle().pipe(
      map((data) => ({
        success: true,
        statusCode: data.statusCode,
        msg: data.msg,
        response: data.response,
      })),
    );
  }
}
