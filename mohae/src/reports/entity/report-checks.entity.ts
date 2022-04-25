import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ReportCheckbox, ReportedBoard, ReportedUser } from './report.entity';

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

@Entity('user_report_checks')
export class UserReportChecks extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @ManyToOne((type) => ReportCheckbox, (checks) => checks.reportedUsers, {
    nullable: true,
  })
  check: ReportCheckbox;

  @ManyToOne((type) => ReportedUser, (report) => report.checks)
  reportedUser: ReportedUser;
}
