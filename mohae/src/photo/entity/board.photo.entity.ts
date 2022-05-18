import { Board } from 'src/boards/entity/board.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('boardPhotos')
export class BoardPhoto extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @Column({
    type: 'varchar',
    comment: '게시글 사진 url',
    default: null,
  })
  photo_url: string | null;

  @ManyToOne((type) => Board, (board) => board.photos, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'board_no' })
  board: Board;
}
