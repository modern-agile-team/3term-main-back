import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateNoticeDto } from './dto/notice.dto';
import { NoticesService } from './notices.service';

@Controller('notices')
export class NoticesController {
  constructor(private noticesService: NoticesService) {}

  @Get()
  async getAllNotices() {
    const response = await this.noticesService.getAllNotices();

    return response;
  }

  @Post()
  async createNotice(@Body() createNoticeDto: CreateNoticeDto) {
    const response = await this.noticesService.createNotice(createNoticeDto);

    return Object.assign({
      statusCode: 201,
      msg: `Notice 생성 완료`,
      response,
    });
  }

  // @Patch('/:noticeNo')
  // async updateFaq(
  //   @Param('noticeNo') no: number,
  //   @Body() updateFaqDto: UpdateFaqDto,
  // ) {
  //   const response = await this.faqsService.updateFaq(no, updateFaqDto);

  //   return Object.assign({
  //     statusCode: 201,
  //     msg: `Notice 수정 완료`,
  //     response,
  //   });
  // }

  @Delete('/:noticeNo')
  async deleteNotice(@Param('noticeNo') no: number) {
    const response = await this.noticesService.deleteNotice(no);

    return Object.assign({
      statusCode: 200,
      msg: `Notice 삭제 완료`,
      response,
    });
  }
}
