import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { Spec } from '../entity/spec.entity';

export class CreateSpecDto extends PickType(Spec, [
  'title',
  'description',
] as const) {}
