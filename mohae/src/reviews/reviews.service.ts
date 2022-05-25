import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@sentry/node';
import { UserRepository } from 'src/auth/repository/user.repository';
import { BoardRepository } from 'src/boards/repository/board.repository';
import { ErrorConfirm } from 'src/common/utils/error';
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
    } catch (err) {
      throw err;
    }
  }

  async createReview(reviewer: User, createReviewDto: CreateReviewDto) {
    const boardNo = createReviewDto.board;
    // const { boardNo } = createReviewDto;
    const reviewerNo = reviewer.no;
    try {
      const board = await this.boardsRepository.findOne(boardNo, {
        relations: ['reviews'],
      });

      this.errorConfirm.notFoundError(
        board,
        '리뷰를 작성하려는 게시글이 없습니다.',
      );

      const affectedRows = await this.reviewRepository.createReview(
        createReviewDto,
        reviewerNo,
        board,
      );

      if (!affectedRows) {
        throw new InternalServerErrorException('알 수 없는 리뷰 작성 오류');
      }

      return { success: true };
    } catch (err) {
      throw err;
    }
  }

  async checkDuplicateReview(reviewer: User, boardNo: number) {
    try {
      const reviewerNo = reviewer.no;
      const board = await this.boardsRepository.findOne(boardNo, {
        select: ['no'],
        relations: ['user', 'reviews'],
      });
      console.log(board);
      if (reviewerNo === board.user.no) {
        throw new BadRequestException(
          '자신이 작성한 게시글에는 리뷰를 남길 수 없습니다.',
        );
      }

      const response = await this.reviewRepository.find();

      return response;
    } catch (err) {
      throw err;
    }
  }
}
