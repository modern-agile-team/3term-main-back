import { User } from 'src/auth/entity/user.entity';
import { Entity, EntityRepository, Repository } from 'typeorm';
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
        .where('likedUserNo = :profileUserNo', { profileUserNo })
        .andWhere('likedMeNo = :userNo', { userNo })
        .execute();
      return numberOfLikes.length;
    } catch (err) {
      throw err;
    }
  }
}
