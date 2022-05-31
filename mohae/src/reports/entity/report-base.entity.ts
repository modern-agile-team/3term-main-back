import { User } from 'src/auth/entity/user.entity';
import { Board } from 'src/boards/entity/board.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
import { BoardReportChecks } from '../../report-checks/entity/board-report-checks.entity';
import { UserReportChecks } from '../../report-checks/entity/user-report-checks.entity';

export abstract class ReportContent extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @Column({
    type: 'mediumtext',
    comment: '게시글 또는 유저 신고 내용',
  })
  description: string;

  /* Timestamps */
  @CreateDateColumn({
    comment: '게시글 또는 유저 신고 생성 일시',
  })
  createdAt: Timestamp;

  @UpdateDateColumn({
    comment: '신고 수정 일자',
  })
  updatedAt: Timestamp;

  @DeleteDateColumn({
    comment: '신고 삭제 일자',
  })
  deletedAt: Timestamp;
}
