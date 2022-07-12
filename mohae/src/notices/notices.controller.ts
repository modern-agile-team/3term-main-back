import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
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
import { Role } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { operationConfig } from 'src/common/swagger-apis/api-operation.swagger';
import { apiResponse } from 'src/common/swagger-apis/api-response.swagger';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { SearchNoticesDto } from './dto/search-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dtd';
import { Notice } from './entity/notice.entity';
import { NoticesService } from './notices.service';

@ApiTags('Notices')
@Controller('notices')
export class NoticesController {
  constructor(private noticesService: NoticesService) {}

  @ApiOperation(
    operationConfig('공지사항 전체 조회 기능', '공지사항을 전체 조회하는 API'),
  )
  @ApiOkResponse(
    apiResponse.success(
      'Notice 전체 조회',
      HTTP_STATUS_CODE.success.ok,
      'Notice 전체 조회 결과 성공',
      [
        {
          no: 1,
          title: 'Notice 예시 제목입니다.',
          description: 'Notice 예시 내용입니다.',
          createdAt: '2022년 07월 11일',
        },
      ],
    ),
  )
  @HttpCode(HTTP_STATUS_CODE.success.ok)
  @Get()
  async readAllNotices(): Promise<object> {
    const response: Notice | Notice[] =
      await this.noticesService.readAllNotices();

    return {
      msg: `Notice 전체 조회 완료`,
      response,
    };
  }

  @ApiOperation(
    operationConfig('공지사항 저장 기능', '공지사항을 저장하는 API'),
  )
  @ApiOkResponse(
    apiResponse.success(
      '공지사항 저장',
      HTTP_STATUS_CODE.success.created,
      '공지사항 저장 결과 성공',
    ),
  )
  @ApiBearerAuth('access-token')
  @Role(true)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HTTP_STATUS_CODE.success.created)
  @Post()
  async createNotice(
    @Body() createNoticeDto: CreateNoticeDto,
    @CurrentUser() manager: User,
  ): Promise<object> {
    await this.noticesService.createNotice(createNoticeDto, manager);

    return {
      msg: `Notice 생성 완료`,
    };
  }

  @ApiOperation(
    operationConfig('공지사항 수정 기능', '공지사항을 수정하는 API'),
  )
  @ApiOkResponse(
    apiResponse.success(
      '공지사항 수정',
      HTTP_STATUS_CODE.success.ok,
      '공지사항 수정 결과 성공',
    ),
  )
  @ApiBearerAuth('access-token')
  @Role(true)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HTTP_STATUS_CODE.success.ok)
  @Put('/:noticeNo')
  async updateNotice(
    @CurrentUser() manager: User,
    @Param('noticeNo') noticeNo: number,
    @Body() updateNoticeDto: UpdateNoticeDto,
  ): Promise<object> {
    await this.noticesService.updateNotice(manager, noticeNo, updateNoticeDto);

    return {
      msg: `Notice 수정 완료`,
    };
  }

  @ApiOperation(
    operationConfig('공지사항 삭제 기능', '공지사항을 삭제하는 API'),
  )
  @ApiOkResponse(
    apiResponse.success(
      '공지사항 삭제',
      HTTP_STATUS_CODE.success.ok,
      '공지사항 삭제 결과 성공',
    ),
  )
  @ApiBearerAuth('access-token')
  @Role(true)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HTTP_STATUS_CODE.success.ok)
  @Delete('/:noticeNo')
  async deleteNotice(@Param('noticeNo') noticeNo: number): Promise<object> {
    await this.noticesService.deleteNotice(noticeNo);

    return {
      msg: '공지사항 삭제 완료',
    };
  }

  @ApiOperation(operationConfig('Notice 검색 기능', 'Notice를 검색하는 API'))
  @ApiOkResponse(
    apiResponse.success(
      'Notice 검색',
      HTTP_STATUS_CODE.success.ok,
      'Notice 검색 결과',
      [
        {
          no: 3,
          title: 'test3',
          description: 'test3',
        },
        {
          no: 2,
          title: 'test2',
          description: 'test2',
        },
      ],
    ),
  )
  @HttpCode(HTTP_STATUS_CODE.success.ok)
  @Get('search')
  async searchNotices(
    @Query() searchNoticesDto: SearchNoticesDto,
  ): Promise<object> {
    const response: Notice | Notice[] = await this.noticesService.searchNotices(
      searchNoticesDto,
    );

    return {
      msg: '검색 결과',
      response,
    };
  }
}
