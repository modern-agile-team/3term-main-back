import { User } from 'src/auth/entity/user.entity';
import { Board } from 'src/boards/entity/board.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';

@Entity('reviews')
export class Review extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly no: number;

  @ManyToOne((type) => Board, (board) => board.no, {
    onDelete: 'SET NULL',
  })
  readonly board: Board;

  @Column({
    type: 'int',
    default: 1,
  })
  // @ManyToOne((type) => User, (user) => user.no, { eager: true })
  readonly reviewer: number;

  @Column({
    type: 'mediumtext',
  })
  readonly description: string;

  @Column({
    type: 'int',
  })
  readonly rating: number;

  @CreateDateColumn()
  readonly in_date: Timestamp;
}
