import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entity/user.entity';
import { UserRepository } from 'src/auth/repository/user.repository';
import { Board } from 'src/boards/entity/board.entity';
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

  async readUserReviews(user: User): Promise<object | undefined> {
    try {
      const { reviews, count }: any =
        await this.reviewRepository.readUserReviews(user.no);

      this.errorConfirm.notFoundError(reviews, '해당 리뷰를 찾을 수 없습니다.');

      if (!reviews.length) {
        return;
      }

      const rating: number =
        reviews.reduce((result: number, review: Review) => {
          return result + review.rating;
        }, 0) / reviews.length;

      return {
        reviews,
        rating: rating.toFixed(1),
        count,
      };
    } catch (err) {
      throw err;
    }
  }

  async createReview(reviewer: User, createReviewDto: CreateReviewDto) {
    const { boardNo }: any = createReviewDto;

    try {
      const board: Board = await this.boardsRepository.findOne(boardNo, {
        select: ['no'],
        relations: ['reviews'],
      });

      this.errorConfirm.notFoundError(
        board,
        '리뷰를 작성하려는 게시글이 없습니다.',
      );

      const affectedRows: number = await this.reviewRepository.createReview(
        createReviewDto,
        reviewer,
        board,
      );

      this.errorConfirm.badGatewayError(
        affectedRows,
        '알 수 없는 리뷰 작성 오류',
      );
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
