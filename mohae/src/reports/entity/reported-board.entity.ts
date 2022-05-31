import { User } from 'src/auth/entity/user.entity';
import { Board } from 'src/boards/entity/board.entity';
import { Entity, ManyToOne, OneToMany } from 'typeorm';
import { BoardReportChecks } from '../../report-checks/entity/board-report-checks.entity';
import { ReportContent } from './report-base.entity';

@Entity('reported_boards')
export class ReportedBoard extends ReportContent {
  /* 신고된 게시글 Relations */
  @ManyToOne((type) => Board, (board) => board.reports, {
    onDelete: 'SET NULL',
  })
  reportedBoard: Board;

  @OneToMany((type) => BoardReportChecks, (checks) => checks.reportedBoard, {
    nullable: true,
  })
  checks: BoardReportChecks[];

  @ManyToOne((type) => User, (user) => user.boardReport, {
    onDelete: 'SET NULL',
  })
  reportUser: User;
}
