import { User } from 'src/auth/entity/user.entity';
import { Board } from 'src/boards/entity/board.entity';
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
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';

@Entity('report_checkboxes')
export class ReportCheckbox extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @Column({
    type: 'varchar',
    length: 30,
    comment: '신고할 때 체크박스의 내용들',
  })
  content: string;

  /* 신고 체크박스 Relations */
  @ManyToMany((type) => ReportedBoard, (report) => report.checks)
  reportedBoards: ReportedBoard[];

  @ManyToMany((type) => ReportedUser, (report) => report.checks)
  reportedUsers: ReportedBoard[];
}

export abstract class ReportContent extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @Column({
    type: 'mediumtext',
    comment: '게시글 또는 유저 신고 내용',
  })
  description: string;

  /* Timestamps */
  @CreateDateColumn({ comment: '게시글 또는 유저 신고 생성 일시' })
  in_date: Timestamp;

  @UpdateDateColumn({ comment: '신고 수정 일자' })
  update_date: Timestamp;

  @DeleteDateColumn({ comment: '신고 삭제 일자' })
  delete_date: Timestamp;
}

@Entity('reported_boards')
export class ReportedBoard extends ReportContent {
  /* 신고된 게시글 Relations */
  @ManyToOne((type) => Board, (board) => board.no, {
    onDelete: 'SET NULL',
  })
  reportedBoard: Board;

  @ManyToMany((type) => ReportCheckbox, (checks) => checks.reportedBoards)
  @JoinTable({ name: 'board_report_checks' })
  checks: ReportCheckbox[];

  @ManyToOne((type) => User, (user) => user.no, {
    onDelete: 'SET NULL',
  })
  reportUser: User;
}

@Entity('reported_users')
export class ReportedUser extends ReportContent {
  /* 신고된 유저 Relations */
  @ManyToOne((type) => User, (user) => user.no, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'reported_user_no' })
  reportedUser: User;

  @ManyToMany((type) => ReportCheckbox, (checks) => checks.reportedUsers)
  @JoinTable({ name: 'user_report_checks' })
  checks: ReportCheckbox[];

  @ManyToOne((type) => User, (user) => user.no, {
    onDelete: 'SET NULL',
  })
  reportUser: User;
}
