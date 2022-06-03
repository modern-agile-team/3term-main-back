import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/auth/entity/user.entity';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Role } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { SuccesseInterceptor } from 'src/common/interceptors/success.interceptor';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dtd';
import { Notice } from './entity/notice.entity';
import { NoticesService } from './notices.service';

@UseInterceptors(SuccesseInterceptor)
@ApiTags('Notices')
@Controller('notices')
export class NoticesController {
  constructor(private noticesService: NoticesService) {}

  @ApiOperation({
    summary: '공지사항 전체 조회 기능',
    description: '공지사항을 전체 조회하는 API',
  })
  @HttpCode(200)
  @Get()
  async readAllNotices(): Promise<object> {
    const response: Notice | Notice[] =
      await this.noticesService.readAllNotices();

    return {
      msg: `Notice 전체 조회 완료`,
      response,
    };
  }

  @ApiOperation({
    summary: '공지사항 저장 기능',
    description: '공지사항을 저장하는 API',
  })
  @Role(true)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard())
  @HttpCode(201)
  @Post()
  async createNotice(
    @Body() createNoticeDto: CreateNoticeDto,
    @CurrentUser() manager: User,
  ): Promise<object> {
    const response: boolean = await this.noticesService.createNotice(
      createNoticeDto,
      manager,
    );

    return {
      msg: `Notice 생성 완료`,
      success: response,
    };
  }

  @ApiOperation({
    summary: '공지사항 수정 기능',
    description: '공지사항을 수정하는 API',
  })
  @Role(true)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard())
  @HttpCode(201)
  @Patch('/:noticeNo')
  async updateNotice(
    @Param('noticeNo') noticeNo: number,
    @Body() updateNoticeDto: UpdateNoticeDto,
    @CurrentUser() manager: User,
  ): Promise<object> {
    const response: boolean = await this.noticesService.updateNotice(
      noticeNo,
      updateNoticeDto,
      manager,
    );

    return {
      msg: `Notice 수정 완료`,
      success: response,
    };
  }

  @ApiOperation({
    summary: '공지사항 삭제 기능',
    description: '공지사항을 삭제하는 API',
  })
  @Delete('/:noticeNo')
  @Role(true)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard())
  async deleteNotice(@Param('noticeNo') noticeNo: number): Promise<object> {
    const response: boolean = await this.noticesService.deleteNotice(noticeNo);

    return Object.assign({
      statusCode: 204,
      msg: `Notice 삭제 완료`,
      success: response,
    });
  }
}
