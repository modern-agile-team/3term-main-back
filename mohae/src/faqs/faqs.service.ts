import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateFaqDto, UpdateFaqDto } from './dto/faq.dto';
import { Faq } from './entity/faq.entity';
import { FaqRepository } from './repository/faq.repository';

@Injectable()
export class FaqsService {
  constructor(
    @InjectRepository(FaqRepository)
    private faqRepository: FaqRepository,
  ) {}

  async findAllFaq(): Promise<Faq[]> {
    const faqs = await this.faqRepository.findAllFaq();

    return faqs;
  }

  async createFaq(createFaqDto: CreateFaqDto) {
    try {
      const createResult = await this.faqRepository.createFaq(createFaqDto);

      if (createResult) {
        return { success: true };
      }

      return { success: false };
    } catch (e) {
      throw e;
    }
  }

  async updateFaq(no: number, updateFaqDto: UpdateFaqDto) {
    const updateResult = this.faqRepository.updateFaq(no, updateFaqDto);

    if (updateResult) {
      return { success: true };
    }

    return { success: false };
  }
}
