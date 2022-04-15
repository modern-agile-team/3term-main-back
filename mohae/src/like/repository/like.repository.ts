import { User } from 'src/auth/entity/user.entity';
import { Entity, EntityRepository, Repository } from 'typeorm';
import { UserLike } from '../entity/user.like.entity';

@EntityRepository(UserLike)
export class LikeRepository extends Repository<UserLike> {
  async likeUser(user, likedUser) {
    try {
      return await this.createQueryBuilder('user_like')
        .insert()
        .into(UserLike)
        .values({ likedMe: user, likedUser: likedUser })
        .execute();
    } catch (err) {
      throw err;
    }
  }

  async dislikeUser(user, likedUser) {
    try {
      return await this.createQueryBuilder('user_like')
        .delete()
        .where('likedMeNo = :likedMe', { likedMe: user.no })
        .andWhere('likedUserNo = :likedUser', { likedUser: likedUser.no })
        .execute();
    } catch (err) {
      throw err;
    }
  }

  async isLike(profileUserNo, userNo) {
    try {
      return await this.createQueryBuilder('user_like')
        .select()
        .where('likedMeNo = :likedMe', { likedMe: profileUserNo })
        .andWhere('likedUserNo = :likedUser', { likedUser: userNo })
        .execute();
    } catch (err) {
      throw err;
    }
  }
}
