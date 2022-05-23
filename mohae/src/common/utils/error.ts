import {
  BadGatewayException,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

export class ErrorConfirm {
  notFoundError(param: any, msg: string | undefined) {
    if (!param) {
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
