import { User } from 'src/auth/entity/user.entity';
import { Board } from 'src/boards/entity/board.entity';
import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('board_likes')
export class BoardLike extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @ManyToOne((type) => Board, (board) => board.no, {
    onDelete: 'CASCADE',
  })
  likedBoard: Board;

  @ManyToOne((type) => User, (user) => user.no, {
    onDelete: 'CASCADE',
  })
  likedUser: User;
}
