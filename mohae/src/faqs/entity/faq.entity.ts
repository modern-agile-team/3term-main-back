import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('faqs')
export class Faq extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @Column()
  title: string;

  @Column()
  description: string;
}
