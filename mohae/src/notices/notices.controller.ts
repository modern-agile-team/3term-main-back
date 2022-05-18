import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { CreateNoticeDto, UpdateNoticeDto } from './dto/notice.dto';
import { Notice } from './entity/notice.entity';
import { NoticesService } from './notices.service';

@Controller('notices')
@ApiTags('Notices')
export class NoticesController {
  constructor(private noticesService: NoticesService) {}

  @ApiOperation({
    summary: '공지사항 전체 조회 기능',
    description: '공지사항을 전체 조회하는 API',
  })
  @Get()
  async readNotices(): Promise<Notice[]> {
    const response = await this.noticesService.readNotices();

    return Object.assign({
      statusCode: 200,
      msg: `Notice 전체 조회 완료`,
      response,
    });
  }

  @ApiOperation({
    summary: '공지사항 저장 기능',
    description: '공지사항을 저장하는 API',
  })
  @Post()
  @Role(true)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard())
  async createNotice(@Body() createNoticeDto: CreateNoticeDto) {
    const response = await this.noticesService.createNotice(createNoticeDto);

    return Object.assign({
      statusCode: 201,
      msg: `Notice 생성 완료`,
      response,
    });
  }

  @ApiOperation({
    summary: '공지사항 수정 기능',
    description: '공지사항을 수정하는 API',
  })
  @Patch('/:noticeNo')
  @Role(true)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard())
  async updateNotice(
    @Param('noticeNo') no: number,
    @Body() UpdateNoticeDto: UpdateNoticeDto,
  ) {
    const response = await this.noticesService.updateNotice(
      no,
      UpdateNoticeDto,
    );

    return Object.assign({
      statusCode: 204,
      msg: `Notice 수정 완료`,
      response,
    });
  }

  @ApiOperation({
    summary: '공지사항 삭제 기능',
    description: '공지사항을 삭제하는 API',
  })
  @Delete('/:noticeNo')
  @Role(true)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard())
  async deleteNotice(@Param('noticeNo') no: number) {
    const { success } = await this.noticesService.deleteNotice(no);

    return Object.assign({
      statusCode: 204,
      msg: `Notice 삭제 완료`,
      success,
    });
  }
}
