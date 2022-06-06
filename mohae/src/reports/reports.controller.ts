import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/auth/entity/user.entity';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { SuccesseInterceptor } from 'src/common/interceptors/success.interceptor';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportedBoard } from './entity/reported-board.entity';
import { ReportedUser } from './entity/reported-user.entity';
import { ReportsService } from './reports.service';

@UseInterceptors(SuccesseInterceptor)
@UseGuards(AuthGuard('jwt'))
@ApiTags('Reports')
@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @ApiOperation({
    summary: '신고된 게시글 상세(선택) 조회',
    description: '신고된 게시글 상세(선택) 조회 API',
  })
  @HttpCode(200)
  @Get('board/:no')
  async readOneReportedBoard(@Param('no') boardNo: number): Promise<object> {
    const response: ReportedBoard =
      await this.reportsService.readOneReportedBoard(boardNo);

    return {
      msg: `No:${boardNo} 신고 내역(게시글)이 조회되었습니다.`,
      response,
    };
  }

  @ApiOperation({
    summary: '신고된 유저 상세(선택) 조회',
    description: '신고된 유저 상세(선택) 조회 API',
  })
  @HttpCode(200)
  @Get('user/:no')
  async readOneReportedUser(@Param('no') userNo: number): Promise<object> {
    const response: ReportedUser =
      await this.reportsService.readOneReportedUser(userNo);

    return {
      msg: `No:${userNo} 신고 내역(유저)이 조회되었습니다.`,
      response,
    };
  }

  @ApiOperation({
    summary: '유저 또는 게시글 신고 생성',
    description: '유저 또는 게시글 신고 생성 API',
  })
  @HttpCode(201)
  @Post()
  async createReport(
    @CurrentUser() reporter: User,
    @Body() createReportDto: CreateReportDto,
  ): Promise<object> {
    await this.reportsService.createReport(reporter, createReportDto);

    return {
      msg: `${createReportDto.head} 신고가 접수되었습니다.`,
    };
  }
}
