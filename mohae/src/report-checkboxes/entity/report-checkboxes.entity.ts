import { Exclude } from 'class-transformer';
import { BoardReportChecks } from 'src/report-checks/entity/board-report-checks.entity';
import { UserReportChecks } from 'src/report-checks/entity/user-report-checks.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
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

  @OneToMany(() => BoardReportChecks, (boardReport) => boardReport.check, {
    nullable: true,
  })
  reportedBoards: BoardReportChecks[];

  @OneToMany(() => UserReportChecks, (userReport) => userReport.check, {
    nullable: true,
  })
  reportedUsers: UserReportChecks[];
}
