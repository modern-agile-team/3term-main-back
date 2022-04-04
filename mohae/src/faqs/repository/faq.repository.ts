import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateFaqDto, UpdateFaqDto } from '../dto/faq.dto';
import { Faq } from '../entity/faq.entity';

@EntityRepository(Faq)
export class FaqRepository extends Repository<Faq> {
  async findAllFaq(): Promise<Faq[]> {
    try {
      const faqs = await this.createQueryBuilder('faqs').getMany();

      return faqs;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async createFaq(createFaqDto: CreateFaqDto) {
    const { title, managerNo, description } = createFaqDto;

    try {
      const { raw } = await this.createQueryBuilder()
        .insert()
        .into(Faq)
        .values([
          {
            title,
            managerNo,
            modifiedManagerNo: managerNo,
            description,
          },
        ])
        .execute();

      return raw.affectedRows;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async updateFaq(no: number, updateFaqDto: UpdateFaqDto) {
    const { title, modifiedManagerNo, description } = updateFaqDto;

    try {
      const { affected } = await this.createQueryBuilder()
        .update(Faq)
        .set({
          title,
          description,
          modifiedManagerNo,
        })
        .where('no = :no', { no })
        .execute();

      return affected;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async deleteFaq(no: number) {
    const { affected } = await this.createQueryBuilder()
      .softDelete()
      .from(Faq)
      .where('no = :no', { no })
      .execute();

    return affected;
  }
}
