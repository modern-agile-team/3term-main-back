import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ReportCheckbox, ReportedBoard } from './report.entity';

@Entity('board_report_checks')
export class BoardReportChecks extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @ManyToOne((type) => ReportCheckbox, (checks) => checks.reportedBoards, {
    nullable: true,
  })
  check: ReportCheckbox;

  @ManyToOne((type) => ReportedBoard, (report) => report.checks)
  reportedBoard: ReportedBoard;
}
