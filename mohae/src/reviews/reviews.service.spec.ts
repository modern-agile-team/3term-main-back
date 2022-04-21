import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/repository/user.repository';
import { BoardRepository } from 'src/boards/repository/board.repository';
import { ErrorConfirm } from 'src/utils/error';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/review.dto';
import { ReviewRepository } from './repository/review.repository';
import { ReviewsService } from './reviews.service';

const MockReviewRepository = () => ({
  readAllReview: jest.fn(),
  readUserReviews: jest.fn(),
  createReview: jest.fn(),
});

const MockUserRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
});

const MockBoardRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('ReviewsService', () => {
  let reviewsService: ReviewsService;
  let reviewRepository: MockRepository<ReviewRepository>;
  let userRepository: MockRepository<UserRepository>;
  let boardRepository: MockRepository<BoardRepository>;
  let errorConfirm: ErrorConfirm;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        ErrorConfirm,
        {
          provide: getRepositoryToken(ReviewRepository),
          useValue: MockReviewRepository(),
        },
        {
          provide: getRepositoryToken(UserRepository),
          useValue: MockUserRepository(),
        },
        {
          provide: getRepositoryToken(BoardRepository),
          useValue: MockBoardRepository(),
        },
      ],
    }).compile();

    reviewsService = module.get<ReviewsService>(ReviewsService);
    reviewRepository = module.get<MockRepository<ReviewRepository>>(
      getRepositoryToken(ReviewRepository),
    );
    userRepository = module.get<MockRepository<UserRepository>>(
      getRepositoryToken(UserRepository),
    );
    boardRepository = module.get<MockRepository<BoardRepository>>(
      getRepositoryToken(BoardRepository),
    );
    errorConfirm = module.get<ErrorConfirm>(ErrorConfirm);
  });

  it('should be defined', () => {
    expect(reviewsService).toBeDefined();
  });

  describe('readReview', () => {
    it('모든 리뷰를 반환', async () => {
      reviewRepository['readAllReview'].mockResolvedValue([
        {
          no: 17,
          description: '가나라바사ㅆㅆㅆ ㅆㅆㅅ',
          rating: 5,
          createdAt: '2022-04-13T14:39:42.063Z',
          board: {
            no: 52,
            title: 'test2',
          },
          reviewer: {
            no: 5,
            photo_url: 'aedesdddfasdf',
            nickname: 'aaaaa',
          },
        },
        {
          no: 23,
          description: '가나라바사ㅆㅆㅆ ㅆㅆㅅ',
          rating: 1,
          createdAt: '2022-04-13T14:52:21.553Z',
          board: {
            no: 52,
            title: 'test2',
          },
          reviewer: {
            no: 1,
            photo_url: '바뀐 사진 url',
            nickname: '바뀐 닉네임!!',
          },
        },
      ]);

      const returnValue = await reviewsService.readAllReview();

      expect(returnValue).toStrictEqual([
        {
          no: 17,
          description: '가나라바사ㅆㅆㅆ ㅆㅆㅅ',
          rating: 5,
          createdAt: '2022-04-13T14:39:42.063Z',
          board: {
            no: 52,
            title: 'test2',
          },
          reviewer: {
            no: 5,
            photo_url: 'aedesdddfasdf',
            nickname: 'aaaaa',
          },
        },
        {
          no: 23,
          description: '가나라바사ㅆㅆㅆ ㅆㅆㅅ',
          rating: 1,
          createdAt: '2022-04-13T14:52:21.553Z',
          board: {
            no: 52,
            title: 'test2',
          },
          reviewer: {
            no: 1,
            photo_url: '바뀐 사진 url',
            nickname: '바뀐 닉네임!!',
          },
        },
      ]);
    });

    it('하나의 리뷰 조회', async () => {
      reviewRepository['readUserReviews'].mockResolvedValue([
        {
          no: 17,
          description: '가나라바사ㅆㅆㅆ ㅆㅆㅅ',
          rating: 5,
          createdAt: '2022-04-13T14:39:42.063Z',
          board: {
            no: 52,
            title: 'test2',
          },
          reviewer: {
            no: 5,
            photo_url: 'aedesdddfasdf',
            nickname: 'aaaaa',
          },
        },
        {
          no: 23,
          description: '가나라바사ㅆㅆㅆ ㅆㅆㅅ',
          rating: 1,
          createdAt: '2022-04-13T14:52:21.553Z',
          board: {
            no: 52,
            title: 'test2',
          },
          reviewer: {
            no: 1,
            photo_url: '바뀐 사진 url',
            nickname: '바뀐 닉네임!!',
          },
        },
      ]);

      const returnValue = await reviewsService.readUserReviews(1);

      expect(returnValue).toStrictEqual({
        rating: '3.0',
        reviews: [
          {
            no: 17,
            description: '가나라바사ㅆㅆㅆ ㅆㅆㅅ',
            rating: 5,
            createdAt: '2022-04-13T14:39:42.063Z',
            board: {
              no: 52,
              title: 'test2',
            },
            reviewer: {
              no: 5,
              photo_url: 'aedesdddfasdf',
              nickname: 'aaaaa',
            },
          },
          {
            no: 23,
            description: '가나라바사ㅆㅆㅆ ㅆㅆㅅ',
            rating: 1,
            createdAt: '2022-04-13T14:52:21.553Z',
            board: {
              no: 52,
              title: 'test2',
            },
            reviewer: {
              no: 1,
              photo_url: '바뀐 사진 url',
              nickname: '바뀐 닉네임!!',
            },
          },
        ],
        count: 2,
      });
    });
  });

  describe('createReview', () => {
    it('리뷰 한 개 생성', async () => {
      reviewRepository['createReview'].mockResolvedValue(1);
      boardRepository['findOne'].mockResolvedValue({
        no: 1,
        reviews: [],
      });
      userRepository['findOne'].mockResolvedValue({
        no: 1,
        reviews: [],
      });

      const createReviewDto: CreateReviewDto = {
        boardNo: 1,
        reviewerNo: 1,
        description: '테스트 내용',
        rating: 5,
      };
      const returnValue = await reviewsService.createReview(createReviewDto);

      expect(returnValue).toStrictEqual({
        success: true,
      });
    });

    describe('생성에러', () => {
      it('리뷰 생성시 게시글이 없을 경우', async () => {
        reviewRepository['createReview'].mockResolvedValue(1);
        userRepository['findOne'].mockResolvedValue({
          no: 1,
          reviews: [],
        });

        const createReviewDto: CreateReviewDto = {
          boardNo: 1,
          reviewerNo: 1,
          description: '테스트 내용',
          rating: 5,
        };

        try {
          await reviewsService.createReview(createReviewDto);
        } catch (e) {
          expect(e).toBeInstanceOf(NotFoundException);
          expect(e.message).toBe('리뷰를 작성하려는 게시글이 없습니다.');
          expect(e.response).toStrictEqual({
            error: 'Not Found',
            message: '리뷰를 작성하려는 게시글이 없습니다.',
            statusCode: 404,
          });
        }
      });

      it('리뷰 생성시 리뷰어 정보가 없을 경우', async () => {
        reviewRepository['createReview'].mockResolvedValue(1);
        boardRepository['findOne'].mockResolvedValue({
          no: 1,
          reviews: [],
        });

        const createReviewDto: CreateReviewDto = {
          boardNo: 1,
          reviewerNo: 1,
          description: '테스트 내용',
          rating: 5,
        };

        try {
          await reviewsService.createReview(createReviewDto);
        } catch (e) {
          expect(e).toBeInstanceOf(NotFoundException);
          expect(e.message).toBe('리뷰 작성자를 찾을 수 없습니다.');
          expect(e.response).toStrictEqual({
            error: 'Not Found',
            message: '리뷰 작성자를 찾을 수 없습니다.',
            statusCode: 404,
          });
        }
      });

      it('리뷰 생성이 되지 않았을 경우', async () => {
        reviewRepository['createReview'].mockResolvedValue(0);
        userRepository['findOne'].mockResolvedValue({
          no: 1,
          reviews: [],
        });
        boardRepository['findOne'].mockResolvedValue({
          no: 1,
          reviews: [],
        });

        const createReviewDto: CreateReviewDto = {
          boardNo: 1,
          reviewerNo: 1,
          description: '테스트 내용',
          rating: 5,
        };

        try {
          await reviewsService.createReview(createReviewDto);
        } catch (e) {
          expect(e).toBeInstanceOf(InternalServerErrorException);
          expect(e.message).toBe('알 수 없는 리뷰 작성 오류');
          expect(e.response).toStrictEqual({
            statusCode: 500,
            message: '알 수 없는 리뷰 작성 오류',
            error: 'Internal Server Error',
          });
        }
      });
    });
  });
});
