import { HTTP_STATUS_CODE } from 'src/common/configs/http-status.config';
import { apiResponse } from 'src/common/swagger-apis/api-response.swagger';

export const profileSwagger: any = {
  internalServerErrorResponse: apiResponse.error(
    '요청에 대한 응답 처리중 서버에러가 발생한 경우',
    HTTP_STATUS_CODE.serverError.internalServerErrorException,
    'DB관련한 에러 메시지 + ~에서 일어난 에러입니다.',
    'InternalServerErrorException',
  ),

  readUserProfile: {
    success: apiResponse.success(
      '성공적으로 유저의 프로필이 불러와진 경우.',
      HTTP_STATUS_CODE.success.created,
      '프로필 조회에 성공했습니다.',
    ),
    unauthorizedResponse: apiResponse.error(
      '회원가입하지 않은 사람이 프로필 조회를 시도한 경우',
      HTTP_STATUS_CODE.clientError.unauthorized,
      'Unauthorized',
      'Unauthorized',
    ),

    notFoundResponse: apiResponse.error(
      '조회 하려는 회원이 존재하지 않는 경우',
      HTTP_STATUS_CODE.clientError.notFound,
      '~에 해당하는 회원을 찾을 수 없습니다.',
      'Not Found',
    ),
  },

  judgeDuplicateNickname: {
    success: apiResponse.success(
      '사용가능한 닉네임인 경우.',
      HTTP_STATUS_CODE.success.created,
      '사용가능한 닉네임입니다.',
    ),
    confilctResponse: apiResponse.error(
      '변경하려는 닉네임이 현재 닉네임이거나 다른사람이 사용하는 경우.',
      HTTP_STATUS_CODE.clientError.conflict,
      '현재 닉네임입니다. or 이미 사용 중인 닉네임 입니다.',
      'Conflict',
    ),
  },
  updateProfile: {
    success: apiResponse.success(
      '성공적으로 유저의 프로필이 수정된 경우.',
      HTTP_STATUS_CODE.success.created,
      '프로필 정보 수정이 완료되었습니다.',
    ),

    unauthorizedResponse: apiResponse.error(
      '토큰이 없는 경우',
      HTTP_STATUS_CODE.clientError.unauthorized,
      'Unauthorized',
      'Unauthorized',
    ),
  },
};
