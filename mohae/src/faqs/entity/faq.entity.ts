import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
