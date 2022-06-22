import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from 'src/auth/entity/user.entity';
import { HTTP_STATUS_CODE } from 'src/common/configs/http-status.config';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { operationConfig } from 'src/common/swagger-apis/api-operation.swagger';
import { apiResponse } from 'src/common/swagger-apis/api-response.swagger';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportedBoard } from './entity/reported-board.entity';
import { ReportedUser } from './entity/reported-user.entity';
import { ReportsService } from './reports.service';

@UseGuards(AuthGuard('jwt'))
@ApiTags('Reports')
@ApiBearerAuth('access-token')
@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @ApiOperation(
    operationConfig(
      '신고된 게시글 상세(선택) 조회',
      '신고된 게시글 상세(선택) 조회 API',
    ),
  )
  @ApiOkResponse(
    apiResponse.success(
      '신고된 게시글 상세 조회 성공',
      HTTP_STATUS_CODE.success.ok,
      '신고된 게시글 상세 조회 성공 결과',
    ),
  )
  @HttpCode(HTTP_STATUS_CODE.success.ok)
  @Get('board/:no')
  async readOneReportedBoard(@Param('no') boardNo: number): Promise<object> {
    const response: ReportedBoard =
      await this.reportsService.readOneReportedBoard(boardNo);

    return {
      msg: `No:${boardNo} 신고 내역(게시글)이 조회되었습니다.`,
      response,
    };
  }

  @ApiOperation(
    operationConfig(
      '신고된 유저 상세(선택) 조회',
      '신고된 유저 상세(선택) 조회 API',
    ),
  )
  @ApiOkResponse(
    apiResponse.success(
      '신고된 유저 상세 조회 성공',
      HTTP_STATUS_CODE.success.ok,
      '신고된 유저 상세 조회 성공 결과',
    ),
  )
  @HttpCode(HTTP_STATUS_CODE.success.ok)
  @Get('user/:no')
  async readOneReportedUser(@Param('no') userNo: number): Promise<object> {
    const response: ReportedUser =
      await this.reportsService.readOneReportedUser(userNo);

    return {
      msg: `No:${userNo} 신고 내역(유저)이 조회되었습니다.`,
      response,
    };
  }

  @ApiOperation(
    operationConfig(
      '유저 또는 게시글 신고 생성',
      '유저 또는 게시글 신고 생성 API',
    ),
  )
  @ApiOkResponse(
    apiResponse.success(
      '신고 저장',
      HTTP_STATUS_CODE.success.created,
      '신고 저장 성공 결과',
    ),
  )
  @HttpCode(HTTP_STATUS_CODE.success.created)
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
