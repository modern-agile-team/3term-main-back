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
    const query = this.reviewRepository.createQueryBuilder('reviews');
    const reviews = await query.getMany();

    return reviews;
  }

  async findOne(no: number): Promise<Review> {
    return await this.reviewRepository.findOne(no);
  }

  async createReview(createReviewDto: CreateReviewDto) {
    await this.reviewRepository.createReview(createReviewDto);
  }
}
