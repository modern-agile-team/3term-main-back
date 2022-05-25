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
    const queryRunner = this.connection.createQueryRunner();

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
      // 직접 생성한 QueryRunner는 해제시켜 주어야 함
      await queryRunner.release();
    }
  }

  // 재능 나눔러와 재능 받은 사람 쌍방 리뷰 남길 수 있음
  // 도움받은 게시글은 자기 자신도 리뷰를 남길 수 있음
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
