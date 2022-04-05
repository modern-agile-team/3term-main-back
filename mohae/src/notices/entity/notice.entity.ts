import { User } from 'src/auth/entity/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('notices')
export class Notice extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @ManyToOne((type) => User, (user) => user.no, { onDelete: 'SET NULL' })
  manager: User;

  @ManyToOne((type) => User, (user) => user.no, { onDelete: 'SET NULL' })
  modifiedManager: User;

  @Column({
    type: 'varchar',
    length: 30,
    comment: '공지사항 제목',
  })
  title: string;

  @Column({
    type: 'mediumtext',
    comment: '공지사항 내용',
  })
  description: string;

  @CreateDateColumn({
    comment: '공지사항 작성일',
  })
  createdAt: Date | null;

  @UpdateDateColumn({
    comment: '공지사항 수정일',
  })
  updatedAt: Date | null;

  @DeleteDateColumn({
    comment: 'FAQ 삭제일',
  })
  deletedAt: Date | null;
}
