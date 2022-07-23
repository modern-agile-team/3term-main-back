import { User } from 'src/auth/entity/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('profile_photos')
export class ProfilePhoto extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @Column({
    type: 'varchar',
    comment: '유저 프로필 url',
  })
  photo_url: string;

  @OneToOne(() => User, (user) => user.profilePhoto, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_no' })
  user: User;
}
