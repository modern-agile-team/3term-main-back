import { ReportCheckbox } from 'src/report-checkboxes/entity/report-checkboxes.entity';
import { ReportedBoard } from 'src/reports/entity/reported-board.entity';
import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
