import { User } from 'src/auth/entity/user.entity';
import { Entity, EntityRepository, Repository } from 'typeorm';
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

  async isBoardLike(boardNo: number, userNo: number) {
    try {
      const numberOfLikes = await this.createQueryBuilder('board_like')
        .select()
        .where('likedBoardNo = :boardNo', { boardNo })
        .andWhere('likedUserNo = :userNo', { userNo })
        .execute();
      console.log(numberOfLikes);
      return numberOfLikes.length;
    } catch (err) {
      throw err;
    }
  }

  async likeBoard(likedBoard, likedUser) {
    try {
      const { raw } = await this.createQueryBuilder('board_like')
        .insert()
        .into(BoardLike)
        .values({ likedBoard, likedUser })
        .execute();

      return raw.affectedRows;
    } catch (err) {
      throw err;
    }
  }

  async dislikeBoard(boardNo: number, userNo: number) {
    try {
      const { affected } = await this.createQueryBuilder('board_like')
        .delete()
        .where('likedBoardNo = :board', { boardNo })
        .andWhere('likedUserNo = :dislikedUser', { userNo })
        .execute();

      return affected;
    } catch (err) {
      throw err;
    }
  }
}
