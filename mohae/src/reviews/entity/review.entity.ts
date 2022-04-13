import { User } from 'src/auth/entity/user.entity';
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
  RelationId,
  UpdateDateColumn,
} from 'typeorm';

@Entity('reviews')
export class Review extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly no: number;

  @Column({
    type: 'mediumtext',
    comment: '리뷰 작성할 때 내용이 들어감',
  })
  readonly description: string;

  @Column({
    type: 'int',
    comment: '리뷰 작성할 때 평점이 들어감',
  })
  readonly rating: number;

  @RelationId((review: Review) => review.reviewer)
  reviewerNo: number;

  @RelationId((review: Review) => review.board)
  boardNo: number;

  /* 게시글 리뷰 Relations */
  @ManyToOne((type) => Board, (board) => board.reviews, {
    onDelete: 'SET NULL',
  })
  board: Board;

  @ManyToOne((type) => User, (user) => user.reviews)
  reviewer: User;

  /* 게시글 리뷰 Timestamps */
  @CreateDateColumn({
    comment: '리뷰 작성하면 시간 입력',
  })
  readonly in_date: Date;

  @UpdateDateColumn()
  readonly updated_date: Date;

  @DeleteDateColumn()
  readonly delete_date: Date;
}
