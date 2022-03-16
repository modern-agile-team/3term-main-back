import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateReviewDto } from '../dto/create-review.dto';
import { Review } from '../entity/review.entity';

@EntityRepository(Review)
export class ReviewRepository extends Repository<Review> {
  async createReview(
    no: number,
    createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    const { reviewerNo, description, rating } = createReviewDto;
    try {
      const createdReview = this.create({
        reviewer: reviewerNo,
        description,
        rating,
      });

      return await createdReview.save();
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
