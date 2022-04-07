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
import { Role } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { CreateNoticeDto, UpdateNoticeDto } from './dto/notice.dto';
import { Notice } from './entity/notice.entity';
import { NoticesService } from './notices.service';

@Controller('notices')
export class NoticesController {
  constructor(private noticesService: NoticesService) {}

  @Get()
  async readNotices(): Promise<Notice[]> {
    const response = await this.noticesService.readNotices();

    return Object.assign({
      statusCode: 200,
      msg: `Notice 전체 조회 완료`,
      response,
    });
  }

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
      statusCode: 201,
      msg: `Notice 수정 완료`,
      response,
    });
  }

  @Delete('/:noticeNo')
  @Role(true)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard())
  async deleteNotice(@Param('noticeNo') no: number) {
    const { success } = await this.noticesService.deleteNotice(no);

    return Object.assign({
      statusCode: 200,
      msg: `Notice 삭제 완료`,
      success,
    });
  }
}
