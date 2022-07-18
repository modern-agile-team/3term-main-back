import { Controller, Get, Param } from '@nestjs/common';
import { MajorsService } from './majors.service';

@Controller('majors')
export class MajorsController {
  constructor(private majorService: MajorsService) {}

  @Get('/:no')
  async getOneMajor(@Param('no') no: number) {
    const major = await this.majorService.findOne(no);
    return major;
  }
}
