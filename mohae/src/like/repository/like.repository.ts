import { User } from 'src/auth/entity/user.entity';
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
