import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Faq } from '../entity/faq.entity';

@EntityRepository(Faq)
export class FaqRepository extends Repository<Faq> {
  async findAllFaq(): Promise<Faq[]> {
    try {
      const faqs = await this.createQueryBuilder('faqs').select().getMany();

      return faqs;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
