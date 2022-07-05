import { User } from 'src/auth/entity/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('terms')
export class Terms extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @Column({
    type: 'varchar',
    comment: '이용약관',
  })
  terms: string;

  @Column({
    type: 'varchar',
    comment: '약관 내용',
  })
  description: string;

  @CreateDateColumn({
    name: 'created_at',
    comment: '약관 생성 시간',
  })
  createdAt: Date;

  @OneToMany((type) => TermsUser, (termsUser) => termsUser.terms, {
    nullable: true,
  })
  userTerms: TermsUser[];
}

@Entity('terms_user')
export class TermsUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @Column({
    type: 'boolean',
    comment: '동의 여부',
  })
  agree: boolean;

  @ManyToOne((type) => User, (user) => user.userTerms, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne((type) => Terms, (terms) => terms.userTerms, {
    onDelete: 'SET NULL',
  })
  terms: Terms;

  @CreateDateColumn({
    name: 'created_at',
    comment: '약관 동의 시간',
  })
  createdAt: Date;
}
