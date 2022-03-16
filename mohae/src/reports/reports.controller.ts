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
import { ApiTags } from '@nestjs/swagger';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportedBoard, ReportedUser } from './entity/report.entity';
import { ReportsService } from './reports.service';

@Controller('reports')
@ApiTags('Reports')
export class ReportsController {
  private logger = new Logger('ReportsController');
  constructor(private reportsService: ReportsService) {}

  // 데이터 입력 테스트를 위한 조회 기능
  @Get('/board/:no')
  findOneBoard(@Param('no') no: number): Promise<ReportedBoard> {
    return this.reportsService.findOneBoard(no);
  }

  @Get('/user/:no')
  findOneUser(@Param('no') no: number): Promise<ReportedUser> {
    return this.reportsService.findOneUser(no);
  }

  @Post('/board/:no')
  @UsePipes(ValidationPipe)
  async createBoardReport(
    @Param('no', ParseIntPipe) no: number,
    @Body() createReportDto: CreateReportDto,
  ) {
    this.logger.verbose(
      `Board report has been received. Reported board Payload: ${JSON.stringify(
        createReportDto,
      )}`,
    );
    const response = await this.reportsService.createBoardReport(
      no,
      createReportDto,
    );

    return Object.assign({
      statusCode: 201,
      msg: '게시글 신고가 접수되었습니다.',
      response,
    });
  }

  @Post('/user')
  @UsePipes(ValidationPipe)
  createUserReport(@Body() createReportUserDto: CreateReportDto) {
    this.logger.verbose(
      `User report has been received. Reported user Payload: ${JSON.stringify(
        createReportUserDto,
      )}`,
    );
    const response = this.reportsService.createUserReport(createReportUserDto);

    return response;
  }
}
