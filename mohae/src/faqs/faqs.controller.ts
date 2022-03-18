import { Controller, Get, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Faq } from './entity/faq.entity';
import { FaqsService } from './faqs.service';

@Controller('faqs')
@ApiTags('Faqs')
export class FaqsController {
  private logger = new Logger('FaqsController');
  constructor(private faqsService: FaqsService) {}

  @Get()
  async findAllFaq(): Promise<Faq[]> {
    const response = await this.faqsService.findAllFaq();

    return Object.assign({
      statusCode: 200,
      msg: `전체 FAQ가 조회되었습니다.`,
      response,
    });
  }
}
