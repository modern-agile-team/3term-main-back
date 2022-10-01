import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';
import { User } from 'src/auth/entity/user.entity';
import { Board } from 'src/boards/entity/board.entity';
import { Reply } from 'src/replies/entity/reply.entity';
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
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('comments')
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @ApiProperty({
    example: '댓글 내용 입력',
    description: '댓글 내용 입력',
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

  @OneToMany(() => Reply, (reply) => reply.comment)
  replies: Reply[];
}
