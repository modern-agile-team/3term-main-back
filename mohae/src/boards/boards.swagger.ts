import { HTTP_STATUS_CODE } from 'src/common/configs/http-status.config';
import { apiResponse } from 'src/common/swagger-apis/api-response.swagger';

export const boardSwagger = {
  filter: {
    success: apiResponse.success(
      '게시글 필터링이 성공적으로 이루어진 경우.',
      HTTP_STATUS_CODE.success.created,
      '게시글 필터링이 완료되었습니다.',
      [
        {
          no: 75,
          photoUrl:
            'https://mohaeproj.s3.amazonaws.com/board/1655961063222_dsn.jpg',
          decimalDay: -10,
          title: 'board test',
          isDeadline: 0,
          price: 0,
          target: 0,
          area: '서울 특별시',
          nickName: 'hheeddjsjde',
        },
      ],
    ),
  },

  popular: {
    success: apiResponse.success(
      '성공여부',
      HTTP_STATUS_CODE.success.ok,
      '인기 게시글 조회 완료',
      [
        {
          no: 8,
          decimalDay: 5,
          photoUrl: null,
          title: '123-5',
          isDeadline: 1,
          price: 1000,
          target: 1,
          area: '서울특별시',
          userNo: 2,
          nickname: 'hneeddjsjde',
        },
      ],
    ),
  },

  search: {
    success: apiResponse.success(
      '성공여부',
      HTTP_STATUS_CODE.success.ok,
      '게시글 검색 완료',
      {
        search: '게시글',
        boards: [
          {
            no: 19,
            photo: '백승범.jpg',
            decimalDay: null,
            title: '게시글 생성 test 3',
            isDeadline: 0,
            price: 1000,
            target: 1,
            area: '서울특별시',
            nickname: 'hneeddjsjde',
          },
        ],
      },
    ),
  },

  closedCancel: {
    success: apiResponse.success(
      '성공여부',
      HTTP_STATUS_CODE.success.ok,
      '게시글 마감 취소 완료',
    ),

    badRequest: apiResponse.error(
      '마감이 안된 게시글을 마감취소를 하려고 하였을 때',
      HTTP_STATUS_CODE.clientError.badRequest,
      '활성화된 게시글 입니다.',
      'Bad Request',
    ),

    unauthorized: apiResponse.error(
      '게시글을 작성한 회원이 아닐 경우',
      HTTP_STATUS_CODE.clientError.unauthorized,
      '게시글을 작성한 유저가 아닙니다.',
      'Unauthorized',
    ),
  },

  closed: {
    success: apiResponse.success(
      '성공여부',
      HTTP_STATUS_CODE.success.ok,
      '게시글 마감이 완료되었습니다.',
    ),

    badRequest: apiResponse.error(
      '이미 마감된 게시글을 마감하려고 했을 때',
      HTTP_STATUS_CODE.clientError.badRequest,
      '이미 마감된 게시글 입니다.',
      'Bad Request',
    ),

    unauthorized: apiResponse.error(
      '게시글을 작성한 회원이 아닐 경우',
      HTTP_STATUS_CODE.clientError.unauthorized,
      '게시글을 작성한 유저가 아닙니다.',
      'Unauthorized',
    ),
  },

  getOne: {
    success: apiResponse.success(
      '성공여부',
      HTTP_STATUS_CODE.success.ok,
      '게시글 상세조회가 완료되었습니다.',
      {
        board: {
          no: 15,
          boardPhotoUrls: 'seungBum.jpg, 11222.jpg, 1.png, 2.jpeg',
          decimalDay: -6,
          title: '게시글 검색',
          description: '생성',
          isDeadline: 0,
          hit: 17,
          price: 1000,
          summary: '',
          target: 1,
          likeCount: 3,
          isLike: 1,
          areaNo: 1,
          areaName: '서울특별시',
          categoryNo: 2,
          categoryName: '디자인',
          userPhotoUrl: 'profile/1655184234165_test.jpg',
          userNo: 2,
          nickname: 'hneeddjsjde',
          schoolName: '인덕대학교',
          majorName: '컴퓨터',
        },
        authorization: true,
      },
    ),

    notFound: apiResponse.error(
      '없는 게시글을 조회 하려고 했을 때',
      HTTP_STATUS_CODE.clientError.notFound,
      '해당 게시글을 찾을 수 없습니다.',
      'Not Found',
    ),
  },

  getByCategory: {
    success: apiResponse.success(
      '성공여부',
      HTTP_STATUS_CODE.success.ok,
      '카테고리 선택 조회가 완료되었습니다.',
      [
        {
          decimalDay: -1,
          photoUrl: '백승범.jpg',
          no: 15,
          title: '게시글 검색',
          isDeadline: 0,
          price: 1000,
          target: 1,
          areaNo: 1,
          areaName: '서울특별시',
          nickname: 'hneeddjsjde',
        },
      ],
    ),
  },

  create: {
    success: apiResponse.success(
      '성공여부',
      HTTP_STATUS_CODE.success.created,
      '게시글 생성이 완료되었습니다.',
    ),
  },

  delete: {
    success: apiResponse.success(
      '성공여부',
      HTTP_STATUS_CODE.success.ok,
      '게시글 삭제가 완료되었습니다.',
    ),

    notFound: apiResponse.error(
      '없는 게시글을 삭제 하려고 했을 때',
      HTTP_STATUS_CODE.clientError.notFound,
      '해당 게시글을 찾을 수 없습니다.',
      'Not Found',
    ),

    unauthorized: apiResponse.error(
      '게시글을 작성한 회원이 아닐 경우',
      HTTP_STATUS_CODE.clientError.unauthorized,
      '게시글을 작성한 유저가 아닙니다.',
      'Unauthorized',
    ),
  },

  update: {
    success: apiResponse.success(
      '성공여부',
      HTTP_STATUS_CODE.success.created,
      '게시글 수정이 완료되었습니다.',
    ),

    notFound: apiResponse.error(
      '없는 게시글을 수정 하려고 했을 때',
      HTTP_STATUS_CODE.clientError.notFound,
      '해당 게시글을 찾을 수 없습니다.',
      'Not Found',
    ),

    unauthorized: apiResponse.error(
      '게시글을 작성한 회원이 아닐 경우',
      HTTP_STATUS_CODE.clientError.unauthorized,
      '게시글을 작성한 유저가 아닙니다.',
      'Unauthorized',
    ),
  },
};
