import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateReportDto } from './dto/report.dto';
import {
  ReportCheckBox,
  ReportedBoard,
  ReportedUser,
} from './entity/report.entity';
import { ReportsService } from './reports.service';

@Controller('reports')
@ApiTags('Reports')
export class ReportsController {
  private logger = new Logger('ReportsController');
  constructor(private reportsService: ReportsService) {}

  @ApiOperation({
    summary: '체크박스 조회',
    description: '체크박스 조회시 체크된 신고들도 함께 불러옴 API',
  })
  @Get('checkboxes')
  async findAllCheckBox(): Promise<ReportCheckBox[]> {
    const response = await this.reportsService.findAllCheckbox();

    return Object.assign({
      statusCode: 200,
      msg: `체크 항목별 조회되었습니다.`,
      response,
    });
  }

  @ApiOperation({
    summary: '신고된 게시글 상세(선택) 조회',
    description: '신고된 게시글 상세(선택) 조회 API',
  })
  @Get('/board/:no')
  async findOneReportedBoard(@Param('no') no: number): Promise<ReportedBoard> {
    const response = await this.reportsService.findOneReportedBoard(no);
    this.logger.verbose(
      `Reported list(board) has been received. Report Payload: ${JSON.stringify(
        response,
      )}`,
    );

    return Object.assign({
      statusCode: 200,
      msg: `No:${no} 신고 내역(게시글)이 조회되었습니다.`,
      response,
    });
  }

  @ApiOperation({
    summary: '신고된 유저 상세(선택) 조회',
    description: '신고된 유저 상세(선택) 조회 API',
  })
  @Get('/user/:no')
  async findOneReportedUser(@Param('no') no: number): Promise<ReportedUser> {
    const response = await this.reportsService.findOneReportedUser(no);

    return Object.assign({
      statusCode: 200,
      msg: `No:${no} 신고 내역(유저)이 조회되었습니다.`,
      response,
    });
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createReport(@Body() createReportDto: CreateReportDto) {
    const response = await this.reportsService.createReport(createReportDto);

    return Object.assign({
      statusCode: 201,
      msg: `${createReportDto.head} 신고가 접수되었습니다.`,
      response,
    });
  }
}
