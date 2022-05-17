import { InternalServerErrorException } from '@nestjs/common';
import { User } from 'src/auth/entity/user.entity';
import { Board } from 'src/boards/entity/board.entity';
import { EntityRepository, Repository } from 'typeorm';
import { BoardLike } from '../entity/board.like.entity';
import { UserLike } from '../entity/user.like.entity';

@EntityRepository(UserLike)
export class LikeRepository extends Repository<UserLike> {
  async likeUser(likedMe, likedUser) {
    try {
      const { raw } = await this.createQueryBuilder('user_like')
        .insert()
        .into(UserLike)
        .values({ likedMe, likedUser })
        .execute();

      return raw.affectedRows;
    } catch (err) {
      throw err;
    }
  }

  async dislikeUser(user, dislikedUser) {
    try {
      const { affected } = await this.createQueryBuilder('user_like')
        .delete()
        .where('likedMeNo = :user', { user })
        .andWhere('likedUserNo = :dislikedUser', { dislikedUser })
        .execute();

      return affected;
    } catch (err) {
      throw err;
    }
  }

  async isLike(profileUserNo, userNo) {
    try {
      const numberOfLikes = await this.createQueryBuilder('user_like')
        .select()
        .where('likedMeNo = :profileUserNo', { profileUserNo })
        .andWhere('likedUserNo = :userNo', { userNo })
        .execute();
      return numberOfLikes.length;
    } catch (err) {
      throw err;
    }
  }
}

@EntityRepository(BoardLike)
export class BoardLikeRepository extends Repository<BoardLike> {
  async isBoardLike(boardNo: number, userNo: number) {
    try {
      const numberOfLikes = await this.createQueryBuilder('board_like')
        .where('likedBoardNo = :boardNo', { boardNo })
        .andWhere('likedUserNo = :userNo', { userNo })
        .execute();

      return numberOfLikes.length;
    } catch (err) {
      throw new InternalServerErrorException(
        `${err} ### 게시글 좋아요 확인: 알 수 없는 서버 에러입니다.`,
      );
    }
  }

  async likeBoard(likedBoard: Board, likedUser: User) {
    try {
      const { raw } = await this.createQueryBuilder('board_like')
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

  async dislikeBoard(boardNo: number, userNo: number) {
    try {
      const { affected } = await this.createQueryBuilder('board_like')
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
