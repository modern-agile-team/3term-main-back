import { Spec } from 'src/specs/entity/spec.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('specPhoto')
export class SpecPhoto extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @Column({
    type: 'varchar',
    comment: '스펙 url',
  })
  photo_url: string;

  @ManyToOne((type) => Spec, (spec) => spec.specPhoto, {
    onDelete: 'SET NULL',
    eager: true,
  })
  @JoinColumn({ name: 'spec_no' })
  spec: Spec;
}