import { Controller, Get, Logger } from '@nestjs/common';
import { Faq } from './entity/faq.entity';
import { FaqsService } from './faqs.service';

@Controller('faqs')
export class FaqsController {
  private logger = new Logger('FaqsController');
  constructor(private faqsService: FaqsService) {}

  @Get()
  findAllFaqs(): Promise<Faq[]> {
    this.logger.verbose(`The user accessed the FAQ.`);
    return this.faqsService.findAllFaqs();
  }
}
