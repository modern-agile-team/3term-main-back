import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateReportBoardDto } from './dto/create-report-board.dto';
import { ReportBoard } from './entity/report.entity';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  // 데이터 입력 테스트를 위한 조회 기능
  @Get('/:id')
  findOne(@Param('id') id: number): Promise<ReportBoard> {
    return this.reportsService.findOne(id);
  }

  @Post('board')
  createBoardReport(
    @Body() createReportBoardDto: CreateReportBoardDto,
  ): Promise<ReportBoard> {
    return this.reportsService.createBoardReport(createReportBoardDto);
  }
}
