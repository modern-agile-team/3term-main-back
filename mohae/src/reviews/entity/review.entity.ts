import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
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
  UpdateDateColumn,
} from 'typeorm';

@Entity('reviews')
export class Review extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @IsNotEmpty({ message: '후기를 작성해 주세요.' })
  @IsString()
  @MaxLength(100, { message: '후기는 100자 이내로 입력해 주세요.' })
  @Column({
    type: 'mediumtext',
    comment: '리뷰 작성할 때 내용이 들어감',
  })
  description: string;

  @IsNotEmpty({ message: '점수를 입력해 주세요.' })
  @IsNumber()
  @Min(1, { message: '평점은 최소 1점이어야 합니다.' })
  @Max(5, { message: '평점은 최대 5점이어야 합니다.' })
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
  @ManyToOne(() => Board, (board) => board.reviews, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'board_no',
  })
  board: Board;

  @ManyToOne(() => User, (user) => user.reviews, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'reviewer_no',
  })
  reviewer: User;

  @ManyToOne(() => User, (user) => user.reviewBasket, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'target_user_no',
  })
  targetUser: User;
}
