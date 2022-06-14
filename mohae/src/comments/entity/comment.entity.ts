import { IsNumber, IsString } from 'class-validator';
import { Board } from 'src/boards/entity/board.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
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

  @IsNumber()
  @Column({
    name: 'commentor_no',
  })
  commentorNo: number;

  @ManyToOne(() => Board, (board) => board.comments, { nullable: true })
  @JoinColumn({
    name: 'board_no',
  })
  board: Board;
}
