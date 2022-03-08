import { Controller, Get } from '@nestjs/common';
import { Faq } from './entity/faq.entity';
import { FaqsService } from './faqs.service';

@Controller('faqs')
export class FaqsController {
  constructor(private faqsService: FaqsService) {}

  @Get()
  findAllFaqs(): Promise<Faq[]> {
    return this.faqsService.findAllFaqs();
  }
}
