import { publishReplay } from 'rxjs';
import { User } from 'src/auth/entity/user.entity';
import { SpecPhoto } from 'src/photo/entity/photo.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('spec')
export class Spec extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @Column({
    type: 'varchar',
    comment: '스펙 제목',
  })
  title: string;

  @Column({
    type: 'mediumtext',
    comment: '스펙 내용',
  })
  description: string;

  @CreateDateColumn({
    name: 'create_at',
    comment: '스팩 등록 시간',
  })
  createdAt: Date;

  @DeleteDateColumn({
    name: 'delete_at',
    comment: '스팩 삭제일',
  })
  deletedAt: Date | null;

  @UpdateDateColumn({
    comment: '마지막 스팩 업데이트 시간',
  })
  latestUpdateSpec: Date;

  @OneToMany((type) => SpecPhoto, (photo) => photo.spec, {
    nullable: true,
  })
  specPhoto: SpecPhoto[];

  @ManyToOne((type) => User, (user) => user.no, {
    // eager: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'user_no' })
  user: User;
}
