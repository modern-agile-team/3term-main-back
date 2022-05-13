import { Area } from 'src/areas/entity/areas.entity';
import { User } from 'src/auth/entity/user.entity';
import { Category } from 'src/categories/entity/category.entity';
import { BoardLike } from 'src/like/entity/board.like.entity';
import { ReportedBoard } from 'src/reports/entity/report.entity';
import { Review } from 'src/reviews/entity/review.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';

@Entity('boards')
export class Board extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @Column({
    type: 'varchar',
    length: 30,
  })
  title: string;

  @Column({
    type: 'mediumtext',
  })
  description: string;

  @Column({
    comment: '게시글 마감유무',
    type: 'boolean',
    default: false,
  })
  isDeadline: boolean;

  @Column({
    type: 'int',
    default: 0,
  })
  hit: number;

  @Column({
    type: 'int',
  })
  price: number;

  @Column({
    type: 'mediumtext',
  })
  summary: string;

  @Column({
    type: 'mediumtext',
  })
  note1: string;

  @Column({
    type: 'mediumtext',
  })
  note2: string;

  @Column({
    type: 'mediumtext',
  })
  note3: string;
  @Column({
    type: 'boolean',
  })
  target: boolean;

  @Column({
    type: 'int',
    default: 0,
  })
  likeCount: number;

  @CreateDateColumn({
    comment: '게시글 생성일',
  })
  createdAt: Date | null;

  @UpdateDateColumn({
    comment: '게시글 수정일',
  })
  updatedAt: Date | null;

  @Column({
    comment: '게시글 마감일',
    type: 'datetime',
    nullable: true,
  })
  deadline: Date;

  @DeleteDateColumn({
    comment: '게시글 삭제일',
  })
  deletedAt: Date | null;

  @OneToMany((type) => ReportedBoard, (report) => report.reportedBoard, {
    nullable: true,
  })
  reports: ReportedBoard[];

  @OneToMany((type) => Review, (review) => review.board, {
    nullable: true,
  })
  reviews: Review[];

  @ManyToOne((type) => User, (user) => user.boards, {
    onDelete: 'SET NULL',
  })
  user: User;

  @ManyToOne((type) => Category, (category) => category.no, {
    onDelete: 'SET NULL',
  })
  category: Category;

  @ManyToOne((type) => Area, (area) => area.no, {
    onDelete: 'SET NULL',
  })
  area: Area;

  @OneToMany((type) => BoardLike, (boardLike) => boardLike.likedUser, {
    nullable: true,
  })
  likedUser: BoardLike[];
  // @ManyToMany((type) => User, (user) => user.likedBoard)
  // @JoinTable({ name: 'board_like' })
  // likedUser: User[];
}
