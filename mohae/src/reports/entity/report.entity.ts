import { User } from 'src/auth/entity/user.entity';
import { Board } from 'src/boards/entity/board.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export abstract class ReportContent extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  // @ManyToOne((type) => User, (user) => user.no, { eager: true })
  reportUser: number;

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
export class ReportedBoard extends ReportContent {
  // @ManyToOne((type) => Board, (board) => board.no, { eager: true })
  reportedBoard: number;
}

@Entity('reported_users')
export class ReportedUser extends ReportContent {
  // @ManyToOne((type) => User, (user) => user.no, { eager: true })
  reportedUser: number;
}
