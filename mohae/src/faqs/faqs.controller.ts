import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateFaqDto, UpdateFaqDto } from './dto/faq.dto';
import { Faq } from './entity/faq.entity';
import { FaqsService } from './faqs.service';

@Controller('faqs')
@ApiTags('Faqs')
export class FaqsController {
  private logger = new Logger('FaqsController');
  constructor(private faqsService: FaqsService) {}

  @Get()
  async readFaqs(): Promise<Faq[]> {
    const response = await this.faqsService.readFaqs();

    return Object.assign({
      statusCode: 200,
      msg: `전체 FAQ가 조회되었습니다.`,
      response,
    });
  }

  @Post()
  async createFaq(@Body() createFaqDto: CreateFaqDto) {
    const response = await this.faqsService.createFaq(createFaqDto);

    return Object.assign({
      statusCode: 201,
      msg: `FAQ 생성 완료`,
      response,
    });
  }

  @Patch('/:faqNo')
  async updateFaq(
    @Param('faqNo') no: number,
    @Body() updateFaqDto: UpdateFaqDto,
  ) {
    const response = await this.faqsService.updateFaq(no, updateFaqDto);

    return Object.assign({
      statusCode: 201,
      msg: `FAQ 수정 완료`,
      response,
    });
  }

  @Delete('/:faqNo')
  async deleteFaq(@Param('faqNo') no: number) {
    const response = await this.faqsService.deleteFaq(no);

    return Object.assign({
      statusCode: 200,
      msg: `FAQ 삭제 완료`,
      response,
    });
  }
}
