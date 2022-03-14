import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('schools')
export class School extends BaseEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  no: number;

  @Column({
    type: 'varchar',
    length: 15,
  })
  name: string;
}
