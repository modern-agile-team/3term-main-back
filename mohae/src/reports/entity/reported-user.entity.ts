import { User } from 'src/auth/entity/user.entity';
import { Entity, ManyToOne, OneToMany } from 'typeorm';
import { UserReportChecks } from '../../report-checks/entity/user-report-checks.entity';
import { ReportContent } from './report-base.entity';

@Entity('reported_users')
export class ReportedUser extends ReportContent {
  /* 신고된 유저 Relations */
  @ManyToOne((type) => User, (user) => user.reports, {
    onDelete: 'SET NULL',
  })
  reportedUser: User;

  @OneToMany((type) => UserReportChecks, (checks) => checks.reportedUser)
  checks: UserReportChecks[];

  @ManyToOne((type) => User, (user) => user.userReport, {
    onDelete: 'SET NULL',
  })
  reportUser: User;
}
