import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from 'src/boards/entity/board.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from './entity/review.entity';
import { ReviewRepository } from './repository/review.repository';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewRepository)
    private reviewRepository: ReviewRepository,
  ) {}

  async findAll(): Promise<Review[]> {
    return await this.reviewRepository.find();
  }

  async findOne(no: number): Promise<Review> {
    return await this.reviewRepository.findOne(no);
  }

  async createReview(createReviewDto: CreateReviewDto, board: Board) {
    await this.reviewRepository.createReview(createReviewDto, board);
  }
}
