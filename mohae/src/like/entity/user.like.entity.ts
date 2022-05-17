import { User } from 'src/auth/entity/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('user_like')
export class UserLike extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  // 좋아요를 누른 유저
  @ManyToOne((type) => User, (user) => user.likedUser, {
    onDelete: 'SET NULL',
  })
  likedMe: User;

  // 좋아요를 받은 유저
  @ManyToOne((type) => User, (user) => user.likedMe, {
    onDelete: 'SET NULL',
  })
  likedUser: User;
}
