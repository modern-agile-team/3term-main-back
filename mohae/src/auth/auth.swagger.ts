import { HTTP_STATUS_CODE } from 'src/common/configs/http-status.config';
import { apiResponse } from 'src/common/swagger-apis/api-response.swagger';

export const authSwagger: any = {
  internalServerErrorResponse: apiResponse.error(
    '요청에 대한 응답 처리중 서버에러가 발생한 경우',
    HTTP_STATUS_CODE.serverError.internalServerErrorException,
    'DB관련한 에러 메시지 + ~에서 일어난 에러입니다.',
    'InternalServerErrorException',
  ),

  signUp: {
    success: apiResponse.success(
      '회원가입이 성공적으로 이루어진 경우.',
      HTTP_STATUS_CODE.success.created,
      '성공적으로 회원가입이 되었습니다.',
    ),

    notFoundResponse: apiResponse.error(
      '변경하려는 학교(전공)이 DB에 존재하지 않는 학교(전공)인 경우',
      HTTP_STATUS_CODE.clientError.notFound,
      '~에 해당하는 학교(전공)을 찾을 수 없습니다.',
      'Not Found',
    ),

    confilctResponse: apiResponse.error(
      '변경하려는 이메일(닉네임)이 이미 사용되고 있는 경우.',
      HTTP_STATUS_CODE.clientError.conflict,
      '해당 (입력한 이메일,입력한 닉네임)이 이미 존재합니다.',
      'Conflict',
    ),

    badGatewayResponse: apiResponse.error(
      'DB에 유저가 만들어 지는 도중 발생한 서버에러',
      HTTP_STATUS_CODE.serverError.badGateway,
      'user 생성 실패',
      'Bad Gateway',
    ),
  },
  signIn: {
    success: apiResponse.success(
      '로그인이 성공적으로 이루어진 경우.',
      HTTP_STATUS_CODE.success.created,
      '성공적으로 로그인이 되었습니다.',
    ),

    unauthorizedResponse: apiResponse.error(
      '1.패널티 시간이 지나지 않았는데 로그인을 다시 시도한 경우 2. 아이디가 맞았는데 비밀번호는 틀린경우',
      HTTP_STATUS_CODE.clientError.unauthorized,
      `1. 아이디 또는 비밀번호가 일치하지 않습니다. 로그인 실패 횟수 (실패 횟수) ,2. 로그인 실패 횟수를 모두 초과 하였습니다 (남은시간)초 뒤에 다시 로그인 해주세요. 실패횟수 :(로그인 시도 횟수)`,
      'Unauthorized',
    ),

    notFoundResponse: apiResponse.error(
      '아이디가 틀린 경우 (msg는 보안상 아이디가 틀렸는지 비밀번호가 틀렸는지 안알려주기 위함임)',
      HTTP_STATUS_CODE.clientError.notFound,
      '아이디 또는 비밀번호가 일치하지 않습니다.',
      'Not Found',
    ),
  },

  signDown: {
    success: apiResponse.success(
      '회원 탈퇴가 성공적으로 이루어진 경우.',
      HTTP_STATUS_CODE.success.created,
      '성공적으로 회원탈퇴가 진행되었습니다.',
    ),

    unauthorizedResponse: apiResponse.error(
      '본인이 다른 사람계정 탈퇴 시키려고 할때 발생하는 오류',
      HTTP_STATUS_CODE.clientError.unauthorized,
      '1.로그인 한 유저와 탈퇴 하려는 유저 번호 불일치! 2.회원님의 이메일이 일치 하지 않습니다.',
      'Unauthorized',
    ),
  },

  changePassword: {
    success: apiResponse.success(
      '비밀번호 변경이 성공적으로 이루어진 경우.',
      HTTP_STATUS_CODE.success.created,
      '성공적으로 비밀번호가 변경되었습니다.',
    ),

    badRequestResponse: apiResponse.error(
      '새비밀번호와 새비밀번호 확인이 일치하지 않는 경우',
      HTTP_STATUS_CODE.serverError.badGateway,
      '새비밀번호와 새비밀번호 확인이 일치하지 않습니다',
      'Bad Request',
    ),

    unauthorizedResponse: apiResponse.error(
      '이메일에 해당하는 비밀번호가 맞지 않을 때 ',
      HTTP_STATUS_CODE.clientError.unauthorized,
      '아이디 또는 비밀번호가 일치하지 않습니다.',
      'Unauthorized',
    ),

    confilctResponse: apiResponse.error(
      '이전 비밀번호로 변경하려고 한 경우',
      HTTP_STATUS_CODE.clientError.conflict,
      '이전의 비밀번호로는 변경하실 수 없습니다.',
      'Conflict',
    ),
  },

  forgetPassword: {
    success: apiResponse.success(
      '비밀번호 변경이 성공적으로 이루어진 경우.',
      HTTP_STATUS_CODE.success.created,
      '성공적으로 비밀번호가 변경되었습니다.',
    ),

    badRequestResponse: apiResponse.error(
      '새비밀번호와 새비밀번호 확인이 일치하지 않는 경우',
      HTTP_STATUS_CODE.serverError.badGateway,
      '새비밀번호와 새비밀번호 확인이 일치하지 않습니다',
      'Bad Request',
    ),

    unauthorizedResponse: apiResponse.error(
      '유효시간이 지난 이후 비밀번호 변경 요청을 보낸경우',
      HTTP_STATUS_CODE.clientError.unauthorized,
      '유효시간이 만료된 토큰 입니다.',
      'Unauthorized',
    ),

    notFoundResponse: apiResponse.error(
      '존재하지 않는 이메일을 입력했을 때',
      HTTP_STATUS_CODE.clientError.notFound,
      '존재하지 않는 이메일 입니다.',
      'Not Found',
    ),

    confilctResponse: apiResponse.error(
      '이전 비밀번호로 변경하려고 한 경우',
      HTTP_STATUS_CODE.clientError.conflict,
      '이전의 비밀번호로는 변경하실 수 없습니다.',
      'Conflict',
    ),
  },
};
