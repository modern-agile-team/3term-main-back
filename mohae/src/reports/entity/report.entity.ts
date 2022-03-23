import { User } from 'src/auth/entity/user.entity';
import { Board } from 'src/boards/entity/board.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
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
    comment: '신고할 때 체크박스의 내용들',
  })
  content: string;

  @ManyToMany((type) => ReportedBoard, (report) => report.checks)
  reportedBoards: ReportedBoard[];
}

export abstract class ReportContent extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @ManyToMany((type) => ReportCheckBox, (checks) => checks.reportedBoards)
  checks: ReportCheckBox[];

  @Column({
    type: 'mediumtext',
    comment: '게시글 또는 유저 신고 내용',
  })
  description: string;

  @CreateDateColumn({ comment: '게시글 또는 유저 신고 생성 일시' })
  in_date: Timestamp;
}

@Entity('reported_boards')
export class ReportedBoard extends ReportContent {
  @ManyToOne((type) => Board, (board) => board.no, {
    onDelete: 'SET NULL',
  })
  reportedBoard: Board;

  @ManyToOne((type) => User, (user) => user.no, {
    onDelete: 'SET NULL',
  })
  // @JoinColumn({ name: 'report_user' })
  reportUser: User;
}

@Entity('reported_users')
export class ReportedUser extends ReportContent {
  @ManyToOne((type) => User, (user) => user.no, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'reported_user_no' })
  reportedUser: User;

  @ManyToOne((type) => User, (user) => user.no, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'report_user_no' })
  reportUser: User;
}
