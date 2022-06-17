import { IsNumber, IsString } from 'class-validator';
import { User } from 'src/auth/entity/user.entity';
import { Board } from 'src/boards/entity/board.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('comments')
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @IsString()
  @Column()
  content: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
  })
  deletedAt: Date | null;

  @ManyToOne(() => Board, (board) => board.comments, { nullable: true })
  @JoinColumn({
    name: 'board_no',
  })
  board: Board;

  @ManyToOne(() => User, (user) => user.comments, { nullable: true })
  @JoinColumn({
    name: 'commenter_no',
  })
  commenter: User;
}
