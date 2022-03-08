import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export abstract class ReportContent extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @Column({
    type: 'int',
  })
  report_user_no: number;

  @Column({
    type: 'int',
  })
  first_no: number;

  @Column({
    type: 'int',
  })
  second_no: number;

  @Column({
    type: 'int',
  })
  third_no: number;

  @Column({
    type: 'mediumtext',
  })
  description: string;
}

@Entity('reported_boards')
export class ReportBoard extends ReportContent {
  @PrimaryGeneratedColumn()
  no: number;

  @Column({
    type: 'int',
  })
  board_no: number;
}

@Entity('reported_users')
export class ReportUser extends ReportContent {
  @PrimaryGeneratedColumn()
  no: number;

  @Column({
    type: 'int',
  })
  user_no: number;
}
