import { Test, TestingModule } from '@nestjs/testing';
import { BoardRepository } from 'src/boards/repository/board.repository';
import { Review } from './entity/review.entity';
import { ReviewRepository } from './repository/review.repository';
import { ReviewsService } from './reviews.service';

const reviews: Review[] = [];

describe('ReviewsService', () => {
  let reviewsService: ReviewsService;
  let reviewRepository: ReviewRepository;
  let boardRepository: BoardRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReviewsService, ReviewRepository, BoardRepository],
    }).compile();

    reviewsService = module.get<ReviewsService>(ReviewsService);
    reviewRepository = module.get<ReviewRepository>(ReviewRepository);
    boardRepository = module.get<BoardRepository>(BoardRepository);
  });

  it('should be defined', () => {
    expect(reviewsService).toBeDefined();
  });

  describe('findAllReview', () => {
    it('모든 리뷰를 반환', async () => {
      jest
        .spyOn(reviewRepository, 'findAllReview')
        .mockResolvedValue(Promise.resolve(reviews));

      const result = await reviewsService.findAllReview();

      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('findOneReview', () => {
    it.todo('리뷰 한 개 조회');
    // it('리뷰 한 개 조회', async () => {
    //   const reviewNo = 10;
    //   const review = reviewsService.findOneReview(reviewNo);
    //   console.log(review);
    //   expect(review).toEqual(1);
    // });
  });
});
