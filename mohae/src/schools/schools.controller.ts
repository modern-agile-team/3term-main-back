import { Controller, Get, Param } from '@nestjs/common';
import { SchoolsService } from './schools.service';

@Controller('schools')
export class SchoolsController {
  constructor(private schoolService: SchoolsService) {}

  @Get('/:no')
  async getOneSchool(@Param('no') no: number) {
    const school = await this.schoolService.findOne(no);
    return school;
  }
}
