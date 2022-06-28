import { InternalServerErrorException } from '@nestjs/common';
import { User } from 'src/auth/entity/user.entity';
import { Board } from 'src/boards/entity/board.entity';
import { BoardLike } from '../entity/board.like.entity';
import {
  DeleteResult,
  EntityRepository,
  InsertResult,
  Repository,
} from 'typeorm';
import { UserLike } from '../entity/user.like.entity';

@EntityRepository(UserLike)
export class LikeRepository extends Repository<UserLike> {
  async likeUser(likedMe: User, likedUser: User): Promise<number> {
    try {
      const { raw }: InsertResult = await this.createQueryBuilder('user_like')
        .insert()
        .into(UserLike)
        .values({ likedMe, likedUser })
        .execute();

      return raw.affectedRows;
    } catch (err) {
      throw err;
    }
  }

  async dislikeUser(user: number, dislikedUser: number): Promise<number> {
    try {
      const { affected }: DeleteResult = await this.createQueryBuilder(
        'user_like',
      )
        .delete()
        .where('likedMeNo = :user', { user })
        .andWhere('likedUserNo = :dislikedUser', { dislikedUser })
        .execute();

      return affected;
    } catch (err) {
      throw err;
    }
  }

  async isLike(profileUserNo: number, userNo: number): Promise<number> {
    try {
      const numberOfLikes: Array<User> = await this.createQueryBuilder(
        'user_like',
      )
        .select()
        .where('likedUserNo = :profileUserNo', { profileUserNo })
        .andWhere('likedMeNo = :userNo', { userNo })
        .execute();
      return numberOfLikes.length;
    } catch (err) {
      throw err;
    }
  }
}

@EntityRepository(BoardLike)
export class BoardLikeRepository extends Repository<BoardLike> {
  async isBoardLike(boardNo: number, userNo: number): Promise<number> {
    try {
      const numberOfLikes = await this.createQueryBuilder('board_like')
        .where('likedBoardNo = :boardNo', { boardNo })
        .andWhere('likedUserNo = :userNo', { userNo })
        .execute();
      console.log(numberOfLikes);
      return numberOfLikes.length;
    } catch (err) {
      throw new InternalServerErrorException(
        `${err} ### 게시글 좋아요 확인: 알 수 없는 서버 에러입니다.`,
      );
    }
  }

  async likeBoard(likedBoard: Board, likedUser: User): Promise<number> {
    try {
      const { raw }: InsertResult = await this.createQueryBuilder('board_like')
        .insert()
        .into(BoardLike)
        .values({ likedBoard, likedUser })
        .execute();

      return raw.affectedRows;
    } catch (err) {
      throw new InternalServerErrorException(
        `${err} ### 게시글 좋아요: 알 수 없는 서버 에러입니다.`,
      );
    }
  }

  async dislikeBoard(boardNo: number, userNo: number): Promise<number> {
    try {
      const { affected }: DeleteResult = await this.createQueryBuilder(
        'board_like',
      )
        .delete()
        .where('likedBoardNo = :boardNo', { boardNo })
        .andWhere('likedUserNo = :userNo', { userNo })
        .execute();

      return affected;
    } catch (err) {
      throw new InternalServerErrorException(
        `${err} ### 게시글 좋아요 취소: 알 수 없는 서버 에러입니다.`,
      );
    }
  }
}
