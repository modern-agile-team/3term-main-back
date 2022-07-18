import { HTTP_STATUS_CODE } from 'src/common/configs/http-status.config';
import { apiResponse } from 'src/common/swagger-apis/api-response.swagger';

export const boardLike = {
  like: {
    success: apiResponse.success(
      '성공여부',
      HTTP_STATUS_CODE.success.ok,
      '성공적으로 요청이 처리되었습니다.',
    ),

    unauthorized: apiResponse.error(
      '가입한 회원이 아닌 경우',
      HTTP_STATUS_CODE.clientError.unauthorized,
      'Unauthorized',
      'Unauthorized',
    ),

    conflict: apiResponse.error(
      '좋아요를 중복해서 눌렀거나, 좋아요 취소를 중복해서 눌렀을 때',
      HTTP_STATUS_CODE.clientError.conflict,
      '좋아요를 중복해서 요청할 수 없습니다 (좋아요 취소는 judge false로 넣어주세요)',
      'Confilct',
    ),

    notFound: apiResponse.error(
      '존재하지 않는 게시글의 좋아요 요청을 보냈을 때',
      HTTP_STATUS_CODE.clientError.notFound,
      '115번의 게시글은 존재하지 않는 게시글 입니다',
      'Not Found',
    ),
  },
};
