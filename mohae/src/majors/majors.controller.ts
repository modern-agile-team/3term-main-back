import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MajorsService } from './majors.service';

@Controller('majors')
@ApiTags('Majors')
export class MajorsController {
  constructor(private majorService: MajorsService) {}

  @Get('/:no')
  async getOneMajor(@Param('no') no: number) {
    const major = await this.majorService.findOne(no);
    return major;
  }
}
