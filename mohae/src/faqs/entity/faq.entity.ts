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

@Entity('faqs')
export class Faq extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @Column({
    type: 'varchar',
    length: 30,
    comment: 'FAQ 제목',
  })
  title: string;

  @Column({
    type: 'mediumtext',
    comment: 'FAQ 내용',
  })
  description: string;

  @CreateDateColumn({
    comment: 'FAQ 작성일',
  })
  createdAt: Date | null;

  @UpdateDateColumn({
    comment: 'FAQ 수정일',
  })
  updatedAt: Date | null;

  @DeleteDateColumn({
    comment: 'FAQ 삭제일',
  })
  deletedAt: Date | null;

  @ManyToOne((type) => User, (user) => user.no, { onDelete: 'SET NULL' })
  manager: User;

  @ManyToOne((type) => User, (user) => user.no, { onDelete: 'SET NULL' })
  lastEditor: User;
}
