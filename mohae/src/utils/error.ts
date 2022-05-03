import { NotFoundException, UnauthorizedException } from '@nestjs/common';

export class ErrorConfirm {
  notFoundError(param, msg) {
    if (!param) {
      throw new NotFoundException(`${msg}`);
    }
  }

  unauthorizedError(param, msg) {
    if (!param) {
      throw new UnauthorizedException(`${msg}`);
    }
  }
}
