import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { School } from './entity/school.entity';
import { SchoolsService } from './schools.service';

@Controller('schools')
@ApiTags('Schools')
export class SchoolsController {
  constructor(private schoolService: SchoolsService) {}

  @Get('/:no')
  async getOneSchool(@Param('no') no: number): Promise<School> {
    return await this.schoolService.findOne(no);
  }
}
