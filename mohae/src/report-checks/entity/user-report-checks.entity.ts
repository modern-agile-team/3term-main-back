import { ReportedUser } from 'src/reports/entity/reported-user.entity';
import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ReportCheckbox } from '../../report-checkboxes/entity/report-checkboxes.entity';

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
