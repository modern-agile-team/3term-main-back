import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportedBoard } from './entity/reported-board.entity';
import { ReportedUser } from './entity/reported-user.entity';
import { ReportsService } from './reports.service';

@Controller('reports')
@UseGuards(AuthGuard())
@ApiTags('Reports')
export class ReportsController {
  private logger = new Logger('ReportsController');
  constructor(private reportsService: ReportsService) {}

  @ApiOperation({
    summary: '신고된 게시글 상세(선택) 조회',
    description: '신고된 게시글 상세(선택) 조회 API',
  })
  @Get('/board/:no')
  async readOneReportedBoard(@Param('no') no: number): Promise<ReportedBoard> {
    const response = await this.reportsService.readOneReportedBoard(no);
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
  async readOneReportedUser(@Param('no') no: number): Promise<ReportedUser> {
    const response = await this.reportsService.readOneReportedUser(no);

    return Object.assign({
      statusCode: 200,
      msg: `No:${no} 신고 내역(유저)이 조회되었습니다.`,
      response,
    });
  }

  @ApiOperation({
    summary: '유저 또는 게시글 신고 생성',
    description: '유저 또는 게시글 신고 생성 API',
  })
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
