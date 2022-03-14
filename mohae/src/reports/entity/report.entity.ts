import { Board } from 'src/boards/entity/board.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export abstract class ReportContent extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @Column({
    type: 'int',
  })
  report_user_no: number;

  @Column({
    type: 'int',
  })
  first_no: number;

  @Column({
    type: 'int',
  })
  second_no: number;

  @Column({
    type: 'int',
  })
  third_no: number;

  @Column({
    type: 'mediumtext',
  })
  description: string;
}

@Entity('reported_boards')
export class ReportBoard extends ReportContent {
  @ManyToOne((type) => Board, (board) => board.no, { eager: true })
  board: number;
}

@Entity('reported_users')
export class ReportUser extends ReportContent {
  @Column({
    type: 'int',
  })
  user_no: number;
}
