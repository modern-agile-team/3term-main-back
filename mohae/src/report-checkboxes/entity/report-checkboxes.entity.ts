import { BoardReportChecks } from 'src/report-checks/entity/board-report-checks.entity';
import { UserReportChecks } from 'src/report-checks/entity/user-report-checks.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
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
  @OneToMany(() => BoardReportChecks, (boardReport) => boardReport.check, {
    nullable: true,
  })
  reportedBoards: BoardReportChecks[];

  @OneToMany(() => UserReportChecks, (userReport) => userReport.check, {
    nullable: true,
  })
  reportedUsers: UserReportChecks[];
}
