import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/repository/user.repository';
import { BoardRepository } from 'src/boards/repository/board.repository';
import { ErrorConfirm } from 'src/utils/error';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from './entity/review.entity';
import { ReviewRepository } from './repository/review.repository';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewRepository)
    private reviewRepository: ReviewRepository,

    @InjectRepository(BoardRepository)
    private boardsRepository: BoardRepository,

    @InjectRepository(UserRepository)
    private userRepository: UserRepository,

    private errorConfirm: ErrorConfirm,
  ) {}

  async findAllReview(): Promise<Review[]> {
    try {
      const reviews = await this.reviewRepository.findAllReview();

      return reviews;
    } catch (e) {
      throw e;
    }
  }

  async findOneReview(no: number): Promise<Review> {
    try {
      const review = await this.reviewRepository.findOneReview(no);

      this.errorConfirm.notFoundError(review, '해당 리뷰를 찾을 수 없습니다.');

      return review;
    } catch (e) {
      throw e;
    }
  }

  async createReview(createReviewDto: CreateReviewDto): Promise<Review> {
    const { boardNo, reviewerNo } = createReviewDto;
    try {
      const board = await this.boardsRepository.findOne(boardNo, {
        relations: ['reviews'],
      });

      this.errorConfirm.notFoundError(
        board,
        '리뷰를 작성하려는 게시글이 없습니다.',
      );

      const reviewer = await this.userRepository.findOne(reviewerNo, {
        relations: ['reviews'],
      });
      this.errorConfirm.notFoundError(
        reviewer,
        '리뷰 작성자를 찾을 수 없습니다.',
      );

      const review = await this.reviewRepository.createReview(createReviewDto);

      board.reviews.push(review);
      reviewer.reviews.push(review);

      await this.boardsRepository.save(board);
      await this.userRepository.save(reviewer);
      return review;
    } catch (e) {
      throw e;
    }
  }
}
