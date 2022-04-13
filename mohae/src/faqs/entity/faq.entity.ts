import { User } from 'src/auth/entity/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
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

  /* 생성, 수정, 삭제 시간 */
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

  /* 관리자 번호 */
  @RelationId((faq: Faq) => faq.manager)
  managerNo: number;

  @RelationId((faq: Faq) => faq.lastEditor)
  lastEditorNo: number;

  /* FAQ 외래키 */
  @ManyToOne((type) => User, (user) => user.no, { onDelete: 'SET NULL' })
  manager: User;

  @ManyToOne((type) => User, (user) => user.no, { onDelete: 'SET NULL' })
  lastEditor: User;
}
