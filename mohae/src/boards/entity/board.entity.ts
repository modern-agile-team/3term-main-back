import { Area } from 'src/areas/entity/areas.entity';
import { Category } from 'src/categories/entity/category.entity';
import { Note } from 'src/notes/entity/note.entity';
import { ReportedBoard } from 'src/reports/entity/report.entity';
import { Review } from 'src/reviews/entity/review.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';

@Entity('boards')
export class Board extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @OneToMany((type) => ReportedBoard, (report) => report.reportedBoard, {
    nullable: true,
    eager: true,
  })
  reports: ReportedBoard[];

  @OneToMany((type) => Review, (review) => review.board, {
    nullable: true,
    eager: true,
  })
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

  @ManyToOne((type) => Category, (category) => category.no, {
    onDelete: 'SET NULL',
  })
  category: Category;

  @ManyToOne((type) => Area, (area) => area.no, { eager: false })
  area: Area;

  @OneToOne(() => Note, (note) => note.board)
  @JoinColumn({ name: 'note_no' })
  note: Note;
}
