import { PickType } from '@nestjs/swagger';
import { Comment } from '../entity/comment.entity';

export class UpdateCommentDto extends PickType(Comment, ['content'] as const) {}
