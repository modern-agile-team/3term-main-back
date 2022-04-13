import { InternalServerErrorException } from '@nestjs/common';
import { User } from 'src/auth/entity/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Faq } from '../entity/faq.entity';

@EntityRepository(Faq)
export class FaqRepository extends Repository<Faq> {
  async readFaqs(): Promise<Faq[]> {
    try {
      const faqs = await this.createQueryBuilder('faqs')
        .leftJoinAndSelect('faqs.manager', 'manager')
        .leftJoinAndSelect('faqs.modifiedManager', 'modifiedManager')
        .getMany();

      return faqs;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async createFaq({ title, description }, manager: User) {
    try {
      const { raw } = await this.createQueryBuilder()
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
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async updateFaq(no: number, { title, description }, manager: User) {
    try {
      const { affected } = await this.createQueryBuilder()
        .update(Faq)
        .set({
          title,
          description,
          lastEditor: manager,
        })
        .where('no = :no', { no })
        .execute();

      return affected;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async deleteFaq(no: number) {
    try {
      const { affected } = await this.createQueryBuilder()
        .softDelete()
        .from(Faq)
        .where('no = :no', { no })
        .execute();

      return affected;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
