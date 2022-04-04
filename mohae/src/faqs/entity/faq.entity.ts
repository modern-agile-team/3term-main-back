import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('faqs')
export class Faq extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @Column({
    type: 'int',
    comment: '관리자 번호',
    name: 'manager_no',
  })
  managerNo: number;

  @Column({
    type: 'int',
    comment: '관리자 번호',
    name: 'modified_manager_no',
  })
  modifiedManagerNo: number;

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
}
