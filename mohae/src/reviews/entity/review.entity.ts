import { Exclude } from 'class-transformer';
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

  @IsNotEmpty({
    message: '후기 내용을 작성해 주세요.',
  })
  @IsString()
  @MaxLength(100, {
    message: '후기 내용은 100자 이내로 입력해 주세요.',
  })
  @Column({
    type: 'mediumtext',
    comment: '리뷰 작성할 때 내용이 들어감',
  })
  description: string;

  @IsNotEmpty({
    message: '점수를 입력해 주세요.',
  })
  @IsNumber()
  @Min(1, {
    message: '평점은 최소 1점이어야 합니다.',
  })
  @Max(5, {
    message: '평점은 최대 5점이어야 합니다.',
  })
  @Column({
    type: 'int',
    comment: '리뷰 작성할 때 평점이 들어감',
  })
  rating: number;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({
    name: 'deleted_at',
  })
  deletedAt: Date | null;

  @ManyToOne(() => Board, (board) => board.reviews, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({
    name: 'board_no',
  })
  board: Board;

  @ManyToOne(() => User, (user) => user.reviews, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({
    name: 'reviewer_no',
  })
  reviewer: User;

  @ManyToOne(() => User, (user) => user.reviewBasket, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({
    name: 'target_user_no',
  })
  targetUser: User;
}
