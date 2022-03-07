import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('reported_boards')
export class ReportBoard extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @Column()
  board_no: number;

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

@Entity('reported_users')
export class ReportUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @Column()
  user_no: number;

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
