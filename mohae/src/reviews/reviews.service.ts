import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewRepository } from './repository/review.repository';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewRepository)
    private reviewRepository: ReviewRepository,
  ) {}

  findAll() {
    return this.reviewRepository.find();
  }
}
