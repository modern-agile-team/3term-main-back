import { ReportedUser } from 'src/reports/entity/report.entity';
import { Review } from 'src/reviews/entity/review.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  Unique,
} from 'typeorm';

@Entity('users')
@Unique(['email', 'nickname'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @OneToMany((type) => Review, (review) => review.reviewer, { eager: false })
  @OneToMany((type) => ReportedUser, (report) => report.reportedUser, {
    eager: false,
  })
  @OneToMany((type) => ReportedUser, (reportUser) => reportUser.reportUser, {
    eager: false,
  })
  no: number;

  @Column({
    type: 'varchar',
    length: 12,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  photo_url: string;

  @Column({
    type: 'timestamp',
  })
  in_date: Timestamp;

  // FK
  @Column({
    type: 'int',
  })
  school_no: number;
  // FK
  @Column({
    type: 'int',
  })
  major_no: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  phone: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  nickname: string;

  @Column({
    type: 'tinyint',
  })
  manager: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  salt: string;
}
