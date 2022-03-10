import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('category')
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  no: number;

  @Column({
    type: 'varchar',
    length: 12,
  })
  name: string;
}
