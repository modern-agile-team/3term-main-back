import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('userPhotos')
export class UserPhotos extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @Column({
    type: 'varchar',
    comment: '유저 프로필 url',
  })
  photo_url: string;
}
