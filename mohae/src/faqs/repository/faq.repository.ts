import { InternalServerErrorException } from '@nestjs/common';
import { User } from 'src/auth/entity/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateFaqDto } from '../dto/create-faq.dto';
import { UpdateFaqDto } from '../dto/update-faq.dto';
import { Faq } from '../entity/faq.entity';

@EntityRepository(Faq)
export class FaqRepository extends Repository<Faq> {
  async readAllFaqs(): Promise<Faq | Faq[]> {
    try {
      const faqs: Faq | Faq[] = await this.createQueryBuilder('faqs')
        .select(['faqs.no', 'faqs.title', 'faqs.description', 'faqs.createdAt'])
        .orderBy('faqs.updatedAt', 'DESC')
        .getMany();

      return faqs;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async createFaq(
    { title, description }: CreateFaqDto,
    manager: User,
  ): Promise<any> {
    try {
      const { raw }: any = await this.createQueryBuilder()
        .insert()
        .into(Faq)
        .values([
          {
            title,
            description,
            manager,
            lastEditor: manager,
          },
        ])
        .execute();

      return raw;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async updateFaq(
    faqNo: number,
    { title, description }: UpdateFaqDto,
    manager: User,
  ): Promise<number> {
    try {
      const { affected }: any = await this.createQueryBuilder()
        .update(Faq)
        .set({
          title,
          description,
          lastEditor: manager,
        })
        .where('no = :faqNo', { faqNo })
        .execute();

      return affected;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteFaq(no: number): Promise<number> {
    try {
      const { affected }: any = await this.createQueryBuilder()
        .softDelete()
        .from(Faq)
        .where('no = :no', { no })
        .execute();

      return affected;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
