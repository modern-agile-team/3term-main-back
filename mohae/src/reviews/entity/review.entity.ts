import { User } from 'src/auth/entity/user.entity';
import { Board } from 'src/boards/entity/board.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('reviews')
export class Review extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @ManyToOne((type) => Board, (board) => board.no, { eager: true })
  board: number;

  @ManyToOne((type) => User, (user) => user.no, { eager: true })
  reviewer: number;

  @Column({
    type: 'mediumtext',
  })
  description: string;

  @Column({
    type: 'int',
  })
  rating: number;

  @Column({
    type: 'timestamp',
  })
  in_date: number;
}
