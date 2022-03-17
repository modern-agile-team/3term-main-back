import { User } from 'src/auth/entity/user.entity';
import { Board } from 'src/boards/entity/board.entity';
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

@Entity('report_checkboxes')
export class ReportCheckBox extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @Column({
    type: 'varchar',
    length: 30,
  })
  content: string;

  @OneToMany((type) => ReportedBoard, (report) => report.first, {
    nullable: true,
    eager: true,
  })
  firstCheckedReport: ReportContent[];

  @OneToMany((type) => ReportedBoard, (report) => report.second, {
    nullable: true,
    eager: true,
  })
  secondCheckedReport: ReportContent[];

  @OneToMany((type) => ReportedBoard, (report) => report.third, {
    nullable: true,
    eager: true,
  })
  thirdCheckedReport: ReportContent[];
}

export abstract class ReportContent extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  // @ManyToOne((type) => User, (user) => user.no, { eager: true })
  reportUser: number;

  @ManyToOne((type) => ReportCheckBox, (reportCheck) => reportCheck.content, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'first_no' })
  first: ReportCheckBox;

  @ManyToOne((type) => ReportCheckBox, (reportCheck) => reportCheck.content, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'second_no' })
  second: ReportCheckBox;

  @ManyToOne((type) => ReportCheckBox, (reportCheck) => reportCheck.content, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'third_no' })
  third: ReportCheckBox;

  @Column({
    type: 'mediumtext',
  })
  description: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  in_date: Timestamp;
}

@Entity('reported_boards')
export class ReportedBoard extends ReportContent {
  @ManyToOne((type) => Board, (board) => board.no, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'reported_board',
  })
  reportedBoard: Board;
}

@Entity('reported_users')
export class ReportedUser extends ReportContent {
  // @ManyToOne((type) => User, (user) => user.no, { eager: true })
  reportedUser: number;
}
