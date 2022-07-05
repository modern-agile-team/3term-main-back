import { Spec } from 'src/specs/entity/spec.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('spec_photos')
export class SpecPhoto extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @Column({
    type: 'varchar',
    comment: '스펙 url',
    default: null,
  })
  photo_url: string | null;

  @ManyToOne((type) => Spec, (spec) => spec.specPhotos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'spec_no' })
  spec: Spec;

  @Column({
    type: 'int',
    comment: '스펙 순서',
    default: null,
  })
  order: number;
}
