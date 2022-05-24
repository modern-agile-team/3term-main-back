import { PickType } from '@nestjs/swagger';
import { Notice } from '../entity/notice.entity';

export class UpdateNoticeDto extends PickType(Notice, [
  'title',
  'description',
] as const) {}
