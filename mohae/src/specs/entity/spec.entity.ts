import { User } from 'src/auth/entity/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('spec')
export class Spec extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @Column({
    type: 'varchar',
    comment: '스펙 제목',
  })
  title: string;

  @Column({
    type: 'mediumtext',
    comment: '스펙 내용',
  })
  description: string;

  @Column({
    type: 'varchar',
    comment: '스펙 관련 사진 url',
  })
  photo_url: string;

  @ManyToOne((type) => User, (user) => user.no, {
    eager: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'user_no' })
  user: User;
}
