import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { User } from 'src/auth/entity/user.entity';
import { Comment } from 'src/comments/entity/comment.entity';
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

@Entity('replies')
export class Reply extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @ApiProperty({
    example: '대댓글(답글) 내용 입력',
    description: '대댓글(답글) 내용 입력',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 500)
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

  @ManyToOne(() => Comment, (comment) => comment.replies, { nullable: true })
  @JoinColumn({
    name: 'comment_no',
  })
  comment: Comment;

  @ManyToOne(() => User, (user) => user.replies, { nullable: true })
  @JoinColumn({
    name: 'writer_no',
  })
  writer: number;
}
