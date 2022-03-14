import { EntityRepository, Repository } from 'typeorm';
import { CreateReviewDto } from '../dto/create-review.dto';
import { Review } from '../entity/review.entity';

@EntityRepository(Review)
export class ReviewRepository extends Repository<Review> {
  async createReview(createReviewDto: CreateReviewDto): Promise<Review> {
    const { boardNo, reviewerNo, description, rating } = createReviewDto;

    const createdReview = this.create({
      board: boardNo,
      reviewer_no: reviewerNo,
      description,
      rating,
    });

    await createdReview.save();
    return createdReview;
  }
}
