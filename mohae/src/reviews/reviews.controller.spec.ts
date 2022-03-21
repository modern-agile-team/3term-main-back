import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsController } from './reviews.controller';

describe('ReviewsController', () => {
  let reviewsController: ReviewsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewsController],
    }).compile();

    reviewsController = module.get<ReviewsController>(ReviewsController);
  });

  it('should be defined', () => {
    expect(reviewsController).toBeDefined();
  });
});
