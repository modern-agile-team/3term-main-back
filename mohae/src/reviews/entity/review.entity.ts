import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { User } from 'src/auth/entity/user.entity';
import { Board } from 'src/boards/entity/board.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('reviews')
export class Review extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  // @IsNotEmpty({ message: '내용을 작성해 주세요.' })
  // @IsString()
  // @MaxLength(100, { message: '100자 이내로 입력해 주세요.' })
  @Column({
    type: 'mediumtext',
    comment: '리뷰 작성할 때 내용이 들어감',
  })
  description: string;

  // @IsNotEmpty({ message: '점수를 입력해 주세요.' })
  // @IsNumber()
  // @Length(1, 5, { message: '1점 ~ 5점 사이 평점을 남겨주세요.' })
  @Column({
    type: 'int',
    comment: '리뷰 작성할 때 평점이 들어감',
  })
  rating: number;

  /* 게시글 리뷰 Timestamps */
  @CreateDateColumn({
    comment: '리뷰 작성 시간',
  })
  createdAt: Date;

  @UpdateDateColumn({
    comment: '리뷰 수정 시간인데 혹시 몰라 생성해둠',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    comment: '리뷰 삭제 시간',
  })
  deletedAt: Date | null;

  /* 게시글 리뷰 Relations */
  @ManyToOne((type) => Board, (board) => board.reviews, {
    onDelete: 'SET NULL',
  })
  board: Board;

  @ManyToOne((type) => User, (user) => user.reviews, {
    onDelete: 'SET NULL',
  })
  reviewer: User;
}
