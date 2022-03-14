import { EntityRepository, Repository } from 'typeorm';
import { CreateReviewDto } from '../dto/create-review.dto';
import { Review } from '../entity/review.entity';

@EntityRepository(Review)
export class ReviewRepository extends Repository<Review> {
  async createReview(createReviewDto: CreateReviewDto): Promise<Review> {
    const { board_no, reviewer_no, description, rating } = createReviewDto;

    const createdReview = this.create({
      board_no,
      reviewer_no,
      description,
      rating,
    });

    await createdReview.save();
    console.log(await createdReview.save());
    return createdReview;
  }
}
