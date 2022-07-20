import { HTTP_STATUS_CODE } from 'src/common/configs/http-status.config';
import { apiResponse } from 'src/common/swagger-apis/api-response.swagger';

export const emailSwagger = {
  question: {
    success: apiResponse.success(
      '성공여부',
      HTTP_STATUS_CODE.success.ok,
      '~님의 문의사항이 성공적으로 전송 되었습니다.',
    ),

    unauthorized: apiResponse.error(
      '로그인을 하지 않고 문의사항을 접수 하려고 할 때',
      HTTP_STATUS_CODE.clientError.unauthorized,
      'Unauthorized',
      'Unauthorized',
    ),
  },

  passwordChange: {
    success: apiResponse.success(
      '성공여부',
      HTTP_STATUS_CODE.success.ok,
      '해당 이메일(??@???.???)로 비밀번호 변경 링크가 전송되었습니다.',
      '숫자들(32193219)',
    ),

    notFound: apiResponse.error(
      '입력한 이메일이 회원이 아닐경우',
      HTTP_STATUS_CODE.clientError.badRequest,
      '해당 email을 가진 유저는 없습니다.',
      'Bad Request',
    ),

    unauthorized: apiResponse.error(
      '이메일에 해당하는 이름이 맞지 않을 경우',
      HTTP_STATUS_CODE.clientError.unauthorized,
      '등록하셨던 이름과 현재 이름이 맞지 않습니다.',
      'Unauthorized',
    ),
  },
};
