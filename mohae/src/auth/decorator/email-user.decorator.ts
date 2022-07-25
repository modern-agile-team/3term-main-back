import { UnprocessableEntityException } from '@nestjs/common';

export function EmailStatusValidationPipe(email?: string): PropertyDecorator {
  let judgeEmail = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
  const isEmail = judgeEmail.test(email);

  try {
    if (!isEmail) {
      throw new UnprocessableEntityException(
        '올바른 이메일 형식을 입력해 주세요',
      );
    }
  } catch (e) {
    return e;
  }
}
