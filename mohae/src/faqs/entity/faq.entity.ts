import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('faqs')
export class Faq extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @Column({
    type: 'varchar',
    length: 30,
  })
  title: string;

  @Column({
    type: 'mediumtext',
  })
  description: string;
}
