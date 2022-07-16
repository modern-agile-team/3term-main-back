import { HTTP_STATUS_CODE } from 'src/common/configs/http-status.config';
import { apiResponse } from 'src/common/swagger-apis/api-response.swagger';

export const specSwagger: any = {
  internalServerErrorResponse: apiResponse.error(
    '요청에 대한 응답 처리중 서버에러가 발생한 경우',
    HTTP_STATUS_CODE.serverError.internalServerErrorException,
    'DB관련한 에러 메시지 + ~에서 일어난 에러입니다.',
    'InternalServerErrorException',
  ),

  getOneSpec: {
    success: apiResponse.success(
      '성공적으로 스펙이 불러와진 경우.',
      HTTP_STATUS_CODE.success.created,
      '성공적으로 스펙을 불러왔습니다.',
    ),

    notFoundResponse: apiResponse.error(
      '찾으려는 스펙이 DB에 존재하지 않는 경우',
      HTTP_STATUS_CODE.clientError.notFound,
      '해당 스펙이 존재하지 않습니다.',
      'Not Found',
    ),
  },

  readUserSpec: {
    success: apiResponse.success(
      '성공적으로 스펙 조회가 된경우 불러와진 경우.',
      HTTP_STATUS_CODE.success.created,
      '프로필 스펙 조회에 성공했습니다.',
    ),
  },

  registSpec: {
    success: apiResponse.success(
      '성공적으로 스펙등록이 되었습니다.',
      HTTP_STATUS_CODE.success.created,
      '성공적으로 스펙등록이 되었습니다.',
    ),

    badRequestResponse: apiResponse.error(
      '스펙등록시 사진을 업로드 하지 않았다면 기본사진을 넣어주셔야 합니다.',
      HTTP_STATUS_CODE.clientError.badRequest,
      '사진을 선택하지 않은 경우 기본사진을 넣어주셔야 스펙 등록이 가능 합니다.',
      'Bad Request',
    ),
  },

  updateSpec: {
    success: apiResponse.success(
      '성공적으로 스펙이 수정 경우.',
      HTTP_STATUS_CODE.success.created,
      '성공적으로 스펙이 수정되었습니다.',
    ),

    forbiddenResponse: apiResponse.error(
      '해당 스펙의 수정 권한이 없는 사용자가 요청을 한 경우.',
      HTTP_STATUS_CODE.clientError.forbidden,
      '스펙의 작성자와 현재 사용자가 다릅니다.',
      'Forbidden',
    ),

    notFoundResponse: apiResponse.error(
      '수정하려는 스펙이 DB에 존재하지 않는 경우(혹시모를 예외처리임)',
      HTTP_STATUS_CODE.clientError.notFound,
      '해당 스펙이 존재하지 않습니다.',
      'Not Found',
    ),
  },

  deleteSpec: {
    success: apiResponse.success(
      '성공적으로 스펙이 삭제된 경우.',
      HTTP_STATUS_CODE.success.created,
      '성공적으로 스펙을 삭제하였습니다.',
    ),

    forbiddenResponse: apiResponse.error(
      '해당 스펙의 수정 권한이 없는 사용자가 요청을 한 경우.',
      HTTP_STATUS_CODE.clientError.forbidden,
      '스펙의 작성자와 현재 사용자가 다릅니다.',
      'Forbidden',
    ),
  },
};
