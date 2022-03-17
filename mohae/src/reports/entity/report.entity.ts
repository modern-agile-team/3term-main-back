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

  @OneToMany((type) => ReportedUser, (report) => report.first, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({
    name: 'report_content',
  })
  reportContents: ReportContent[];
}

export abstract class ReportContent extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  // @ManyToOne((type) => User, (user) => user.no, { eager: true })
  reportUser: number;

  @ManyToOne((type) => ReportCheckBox, (reportCheck) => reportCheck.content, {
    onDelete: 'SET NULL',
  })
  first: ReportCheckBox;

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
