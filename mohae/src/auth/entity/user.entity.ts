import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Timestamp,
  Unique,
} from 'typeorm';

@Entity('users')
@Unique(['email', 'nickname'])
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
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
