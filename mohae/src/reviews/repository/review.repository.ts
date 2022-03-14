import { Board } from 'src/boards/entity/board.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateReviewDto } from '../dto/create-review.dto';
import { Review } from '../entity/review.entity';

@EntityRepository(Review)
export class ReviewRepository extends Repository<Review> {
  async createReview(createReviewDto: CreateReviewDto, board: Board) {
    const { reviewer_no, description, rating } = createReviewDto;

    const createdReview = this.create({
      board,
      reviewer_no,
      description,
      rating,
    });

    await createdReview.save();
    return true;
  }
}
