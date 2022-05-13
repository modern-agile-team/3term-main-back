import { User } from 'src/auth/entity/user.entity';
import { Board } from 'src/boards/entity/board.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('categories')
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @Column({
    type: 'varchar',
    length: 12,
    comment: '카테고리 종류',
  })
  name: string;

  @Column({
    type: 'varchar',
    comment: '카테고리 사진',
  })
  photo_url: string;

  @OneToMany((type) => Board, (board) => board.category, {
    nullable: true,
  })
  boards: Board[];

  @ManyToMany((type) => User, (user) => user.categories)
  users: User[];
}
