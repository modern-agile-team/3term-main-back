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
          no: 1,
          description: '테트 가아',
          createdAt: '2022-04-13T14:18:50.911Z',
          board: 15,
          reviewer: 1,
        },
        {
          no: 2,
          description: '테트 가아',
          createdAt: '2022-04-13T14:18:50.911Z',
          board: 15,
          reviewer: 2,
        },
      ]);
      const returnValue = await reviewsService.readAllReview();

      expect(returnValue).toStrictEqual([
        {
          no: 1,
          description: '테트 가아',
          createdAt: '2022-04-13T14:18:50.911Z',
          board: 15,
          reviewer: 1,
        },
        {
          no: 2,
          description: '테트 가아',
          createdAt: '2022-04-13T14:18:50.911Z',
          board: 15,
          reviewer: 2,
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
      });
    });
  });

  describe('createReview', () => {
    it('리뷰 한 개 생성', async () => {
      reviewRepository['createReview'].mockResolvedValue({
        no: 1,
        boardNo: [
          {
            no: 1,
            title: '테스트 게시글',
          },
        ],
        reviewerNo: [
          {
            no: 1,
            name: '테스트 유저',
          },
        ],
      });
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
  });
});
