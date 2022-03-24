import { NotFoundException } from '@nestjs/common';

export class ErrorConfirm {
  notFoundError(param, msg) {
    if (!param) {
      throw new NotFoundException(`${msg}`);
    }
  }
}
