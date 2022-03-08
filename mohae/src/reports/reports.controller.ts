import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  CreateReportBoardDto,
  CreateReportUserDto,
} from './dto/create-report.dto';
import { ReportBoard, ReportUser } from './entity/report.entity';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  private logger = new Logger('ReportsController');
  constructor(private reportsService: ReportsService) {}

  // 데이터 입력 테스트를 위한 조회 기능
  @Get('/:id')
  findOne(@Param('id') id: number): Promise<ReportBoard> {
    return this.reportsService.findOne(id);
  }

  @Post('board')
  @UsePipes(ValidationPipe)
  createBoardReport(
    @Body() createReportBoardDto: CreateReportBoardDto,
  ): Promise<ReportBoard> {
    this.logger.verbose(
      `Board report has been received. Reported board Payload: ${JSON.stringify(
        createReportBoardDto,
      )}`,
    );
    return this.reportsService.createBoardReport(createReportBoardDto);
  }

  @Post('user')
  @UsePipes(ValidationPipe)
  createUserReport(
    @Body() createReportUserDto: CreateReportUserDto,
  ): Promise<ReportUser> {
    this.logger.verbose(
      `User report has been received. Reported user Payload: ${JSON.stringify(
        createReportUserDto,
      )}`,
    );
    return this.reportsService.createUserReport(createReportUserDto);
  }
}
