import { Exclude } from 'class-transformer';
import { ReportedUser } from 'src/reports/entity/reported-user.entity';
import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ReportCheckbox } from '../../report-checkboxes/entity/report-checkboxes.entity';

@Entity('user_report_checks')
export class UserReportChecks extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({
    name: 'deleted_at',
  })
  deletedAt: Date | null;

  @ManyToOne(() => ReportCheckbox, (checks) => checks.reportedUsers, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({
    name: 'check_no',
  })
  check: ReportCheckbox;

  @ManyToOne(() => ReportedUser, (reportedUsers) => reportedUsers.checks, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({
    name: 'reported_user_no',
  })
  reportedUser: ReportedUser;
}
