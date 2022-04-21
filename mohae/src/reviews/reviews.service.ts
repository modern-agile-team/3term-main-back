import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/repository/user.repository';
import { BoardRepository } from 'src/boards/repository/board.repository';
import { ErrorConfirm } from 'src/utils/error';
import { CreateReviewDto } from './dto/review.dto';
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

  async readAllReview(): Promise<Review[]> {
    try {
      const reviews = await this.reviewRepository.readAllReview();

      return reviews;
    } catch (e) {
      throw e;
    }
  }

  async readUserReviews(no: number) {
    try {
      const { reviews, count } = await this.reviewRepository.readUserReviews(
        no,
      );
      this.errorConfirm.notFoundError(reviews, '해당 리뷰를 찾을 수 없습니다.');

      const rating =
        reviews.reduce((result, review) => {
          return result + review.rating;
        }, 0) / reviews.length;

      return { reviews, rating: rating.toFixed(1), count };
    } catch (e) {
      throw e;
    }
  }

  async createReview(createReviewDto: CreateReviewDto) {
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

      const affectedRows = await this.reviewRepository.createReview(
        createReviewDto,
        reviewer,
        board,
      );

      if (!affectedRows) {
        throw new InternalServerErrorException('알 수 없는 리뷰 작성 오류');
      }

      return { success: true };
    } catch (e) {
      throw e;
    }
  }
}
