import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FindRelationsNotFoundError } from 'typeorm';
import { School } from './entity/school.entity';
import { SchoolsService } from './schools.service';

@Controller('schools')
@ApiTags('Schools')
export class SchoolsController {
  constructor(private schoolService: SchoolsService) {}

  @Get(':no')
  findOne(@Param('no') no: number): Promise<School> {
    return this.schoolService.findOne(no);
  }
}
