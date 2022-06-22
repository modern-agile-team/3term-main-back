import { PickType } from '@nestjs/swagger';
import { Reply } from '../entity/reply.entity';

export class CreateReplyDto extends PickType(Reply, ['content'] as const) {}
