import { CreateReviewDto } from 'src/reviews/dto/create-review.dto';
import { ReviewRepository } from 'src/reviews/repository/review.repository';
import { EntityRepository, Repository } from 'typeorm';
import { CreateBoardDto } from '../dto/board.dto';
import { Board } from '../entity/board.entity';

@EntityRepository(Board)
export class BoardRepository extends Repository<Board> {
  async createBoard(createBoardDto: CreateBoardDto): Promise<Board> {
    const { price, title, description, summary, target, category } =
      createBoardDto;

    const createdboard = this.create({
      price,
      title,
      description,
      summary,
      target,
      category,
    });

    await createdboard.save();
    return createdboard;
  }

  async createReview(
    no: number,
    createReviewDto: CreateReviewDto,
    reviewRepository: ReviewRepository,
  ): Promise<Board> {
    const board = await this.findOne(no, {
      relations: ['reviews'],
    });

    const review = await reviewRepository.save(createReviewDto);
    board.reviews.push(review);
    return await this.save(board);
  }
}
