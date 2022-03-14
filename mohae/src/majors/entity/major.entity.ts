import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('majors')
export class Major extends BaseEntity {
  @PrimaryGeneratedColumn({
  })
  no: number;

  @Column({
    type: 'varchar',
    length: 15,
  })
  name: string;
}
