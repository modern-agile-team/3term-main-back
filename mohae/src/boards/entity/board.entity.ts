import { Category } from 'src/categories/entity/category.entity';
import { ReportBoard } from 'src/reports/entity/report.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';

@Entity('boards')
export class Board extends BaseEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  @OneToMany(() => ReportBoard, (report) => report.board_no, { eager: false })
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
    type: 'timestamp',
  })
  in_date: Timestamp;

  @Column({
    type: 'int',
  })
  thumb: number;

  @Column({
    type: 'int',
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

  @ManyToOne((type) => Category, (category) => category.no, { eager: true })
  category_no: number;
}
