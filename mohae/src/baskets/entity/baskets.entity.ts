import { IsNumber } from 'class-validator';
import { User } from 'src/auth/entity/user.entity';
import { Board } from 'src/boards/entity/board.entity';
import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('baskets')
export class Basket extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @IsNumber()
  @ManyToOne((type) => User, (user) => user.no, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'user_no' })
  userNo: User;

  @IsNumber()
  @ManyToOne((type) => Board, (board) => board.no, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'board_no' })
  boardNo: Board;
}
