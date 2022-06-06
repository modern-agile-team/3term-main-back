import { Exclude } from 'class-transformer';
import { ReportCheckbox } from 'src/report-checkboxes/entity/report-checkboxes.entity';
import { ReportedBoard } from 'src/reports/entity/reported-board.entity';
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

@Entity('board_report_checks')
export class BoardReportChecks extends BaseEntity {
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

  @ManyToOne(() => ReportCheckbox, (checks) => checks.reportedBoards, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({
    name: 'check_no',
  })
  check: ReportCheckbox;

  @ManyToOne(() => ReportedBoard, (reportedBoards) => reportedBoards.checks, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({
    name: 'reported_board_no',
  })
  reportedBoard: ReportedBoard;
}
