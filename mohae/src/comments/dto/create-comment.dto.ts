import { PickType } from '@nestjs/swagger';
import { Comment } from '../entity/comment.entity';

export class CreateCommentDto extends PickType(Comment, [
  'content',
  'commentorNo',
] as const) {}
