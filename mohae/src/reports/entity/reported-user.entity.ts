import { User } from 'src/auth/entity/user.entity';
import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { UserReportChecks } from '../../report-checks/entity/user-report-checks.entity';
import { ReportContent } from './report-base.entity';

@Entity('reported_users')
export class ReportedUser extends ReportContent {
  @ManyToOne(() => User, (user) => user.reports, {
    onUpdate: 'CASCADE',
    onDelete: 'NO ACTION',
    nullable: false,
  })
  @JoinColumn({
    name: 'reported_user_no',
  })
  reportedUser: User;

  @ManyToOne(() => User, (user) => user.userReport, {
    onUpdate: 'CASCADE',
    onDelete: 'NO ACTION',
    nullable: false,
  })
  @JoinColumn({
    name: 'report_user_no',
  })
  reportUser: User;

  @OneToMany(
    () => UserReportChecks,
    (userReportCheck) => userReportCheck.reportedUser,
    {
      nullable: true,
    },
  )
  checks: UserReportChecks[];
}
