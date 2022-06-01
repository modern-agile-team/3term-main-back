import { PickType } from '@nestjs/swagger';
import { Spec } from '../entity/spec.entity';

export class CreateSpecDto extends PickType(Spec, [
  'title',
  'description',
] as const) {}
