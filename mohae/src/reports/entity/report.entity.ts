import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export abstract class ReportContent extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @Column()
  report_user_no: number;

  @Column()
  first_no: number;

  @Column()
  second_no: number;

  @Column()
  third_no: number;

  @Column()
  description: string;
}

@Entity('reported_boards')
export class ReportBoard extends ReportContent {
  @PrimaryGeneratedColumn()
  no: number;

  @Column()
  board_no: number;
}

@Entity('reported_users')
export class ReportUser extends ReportContent {
  @PrimaryGeneratedColumn()
  no: number;

  @Column()
  user_no: number;
}
