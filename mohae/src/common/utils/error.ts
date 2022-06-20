import {
  BadGatewayException,
  BadRequestException,
  Inject,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { WinstonLogger, WINSTON_MODULE_PROVIDER } from 'nest-winston';
// isNotExist 방식으로
export class ErrorConfirm {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger,
  ) {}

  notFoundError(param: any, msg: string | undefined) {
    if (!param) {
      this.logger.error('Not found exception error => ', msg);
      throw new NotFoundException(`${msg}`);
    }
  }

  unauthorizedError(param: any, msg: string | undefined) {
    if (!param) {
      throw new UnauthorizedException(`${msg}`);
    }
  }

  badGatewayError(param: any, msg: string | undefined) {
    if (!param) {
      throw new BadGatewayException(`${msg}`);
    }
  }

  badRequestError(param: any, msg: string | undefined) {
    if (!param) {
      throw new BadRequestException(`${msg}`);
    }
  }

  serverError(msg: string | undefined) {
    throw new InternalServerErrorException(`${msg}`);
  }
}
