import {
  CanActivate,
  ExecutionContext,
  Header,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { string } from 'joi';
import { Observable } from 'rxjs';

@Injectable()
export class AccessGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (!(process.env.NODE_ENV === 'production')) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const DOMAIN = process.env.API_ACCESS_DOMAIN;

    const token = request.headers['api-key'];
    if (token !== `${DOMAIN}`) {
      throw new UnauthorizedException(
        `허가받지 못한 사이트는 해당 API를 사용할 수 없습니다.${
          (request.get('host'), request)
        }`,
      );
    }

    return true;
  }
}
