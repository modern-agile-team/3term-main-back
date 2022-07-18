import { HTTP_STATUS_CODE } from 'src/common/configs/http-status.config';
import { apiResponse } from 'src/common/swagger-apis/api-response.swagger';

export const categorySwagger = {
  popular: {
    success: apiResponse.success(
      '성공여부',
      HTTP_STATUS_CODE.success.ok,
      '인기 카테고리 조회 완료',
      [
        {
          no: 2,
          name: '디자인',
        },
        {
          no: 4,
          name: '사진/영상',
        },
        {
          no: 3,
          name: 'IT/개발',
        },
        {
          no: 8,
          name: '컨설팅',
        },
        {
          no: 5,
          name: '기획/마케팅',
        },
      ],
    ),
  },
};
