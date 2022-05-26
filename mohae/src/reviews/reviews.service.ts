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
import { Connection } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';

import { Review } from './entity/review.entity';
import { ReviewRepository } from './repository/review.repository';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewRepository)
    private reviewRepository: ReviewRepository,

    private boardsRepository: BoardRepository,
    private userRepository: UserRepository,
    private connection: Connection,
    private errorConfirm: ErrorConfirm,
  ) {}

  async readUserReviews(targetUserNo: number): Promise<object | undefined> {
    try {
      const { reviews, count }: any =
        await this.reviewRepository.readUserReviews(targetUserNo);

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

  async createReview(
    reviewer: User,
    createReviewDto: CreateReviewDto,
  ): Promise<void> {
    const { boardNo, targetUserNo }: any = createReviewDto;
    const queryRunner: any = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const board: Board = await this.boardsRepository.findOne(boardNo, {
        select: ['no'],
        relations: ['reviews'],
      });

      this.errorConfirm.notFoundError(
        board,
        '리뷰를 작성하려는 게시글이 없습니다.',
      );

      const targetUser: User = await this.userRepository.findOne(targetUserNo);

      this.errorConfirm.notFoundError(
        targetUser,
        '대상 유저를 찾을 수 없습니다.',
      );

      const { affectedRows, insertId } = await queryRunner.manager
        .getCustomRepository(ReviewRepository)
        .createReview(createReviewDto, reviewer, targetUser, board);

      this.errorConfirm.badGatewayError(affectedRows, '리뷰 저장 실패');

      await queryRunner.manager
        .getCustomRepository(UserRepository)
        .userRelation(reviewer.no, insertId, 'reviews');
      await queryRunner.manager
        .getCustomRepository(UserRepository)
        .userRelation(targetUser.no, insertId, 'reviewBasket');

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async checkDuplicateReview(
    requester: User,
    targetUserNo: number,
    boardNo: number,
  ): Promise<void> {
    try {
      const requesterNo: number = requester.no;

      const isReview: boolean =
        await this.reviewRepository.checkDuplicateReview(
          requesterNo,
          targetUserNo,
          boardNo,
        );

      if (isReview) {
        throw new BadRequestException('작성한 리뷰가 존재합니다.');
      }
    } catch (err) {
      throw err;
    }
  }
}
