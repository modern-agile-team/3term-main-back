import { User } from 'src/auth/entity/user.entity';
import { Board } from 'src/boards/entity/board.entity';
import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BoardReportChecks } from '../../report-checks/entity/board-report-checks.entity';
import { ReportContent } from './report-base.entity';

@Entity('reported_boards')
export class ReportedBoard extends ReportContent {
  /* 신고된 게시글 Relations */
  @ManyToOne(() => Board, (board) => board.reports, {
    onUpdate: 'CASCADE',
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'reported_board_no' })
  reportedBoard: Board;

  @OneToMany(() => BoardReportChecks, (checks) => checks.reportedBoard, {
    nullable: true,
  })
  checks: BoardReportChecks[];

  @ManyToOne(() => User, (user) => user.boardReport, {
    onUpdate: 'CASCADE',
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'report_user_no' })
  reportUser: User;
}
