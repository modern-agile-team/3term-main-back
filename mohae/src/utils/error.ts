import {
  BadGatewayException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

export class ErrorConfirm {
  notFoundError(param: any, msg: any) {
    if (!param) {
      throw new NotFoundException(`${msg}`);
    }
  }

  unauthorizedError(param: any, msg: any) {
    if (!param) {
      throw new UnauthorizedException(`${msg}`);
    }
  }

  badGatewayError(param: any, msg: any) {
    if (!param) {
      throw new BadGatewayException(`${msg}`);
    }
  }
}
