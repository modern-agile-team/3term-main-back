import { Category } from 'src/categories/entity/category.entity';
import { ReportedBoard } from 'src/reports/entity/report.entity';
import { Review } from 'src/reviews/entity/review.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';

@Entity('boards')
export class Board extends BaseEntity {
  @PrimaryGeneratedColumn()
  @OneToMany((type) => ReportedBoard, (report) => report.reportedBoard, {
    eager: false,
  })
  no: number;

  @OneToMany((type) => Review, (review) => review.board, { nullable: true })
  reviews: Review[];

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
    type: 'timestamp',
  })
  in_date: Timestamp;

  @Column({
    type: 'int',
    default: 0,
  })
  thumb: number;

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
    type: 'boolean',
  })
  target: boolean;

  // @ManyToOne((type) => Category, (category) => category.no, { eager: true })
  category: number;

  // @ManyToOne((type) => Area, (area) => area.no, { eager: true })
  area: number;
}
