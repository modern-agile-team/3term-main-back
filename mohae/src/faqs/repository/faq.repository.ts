import { InternalServerErrorException } from '@nestjs/common';
import { User } from 'src/auth/entity/user.entity';
import {
  DeleteResult,
  EntityRepository,
  InsertResult,
  Repository,
  UpdateResult,
} from 'typeorm';
import { CreateFaqDto } from '../dto/create-faq.dto';
import { UpdateFaqDto } from '../dto/update-faq.dto';
import { Faq } from '../entity/faq.entity';

@EntityRepository(Faq)
export class FaqRepository extends Repository<Faq> {
  async readAllFaqs(): Promise<Faq | Faq[]> {
    try {
      const faqs: Faq | Faq[] = await this.createQueryBuilder('faqs')
        .select(['faqs.no', 'faqs.title', 'faqs.description'])
        .orderBy('faqs.createdAt', 'DESC')
        .getMany();

      return faqs;
    } catch (err) {
      throw new InternalServerErrorException(
        `${err.message} ### FAQ 전체조회 : 알 수 없는 서버 에러입니다.`,
      );
    }
  }

  async createFaq(
    { title, description }: CreateFaqDto,
    manager: User,
  ): Promise<any> {
    const createFaqData: object = {
      title,
      description,
      manager,
      lastEditor: manager,
    };

    try {
      const { raw }: InsertResult = await this.createQueryBuilder()
        .insert()
        .into(Faq)
        .values(createFaqData)
        .execute();

      return raw;
    } catch (err) {
      throw new InternalServerErrorException(
        `${err.message} ### FAQ 생성 : 알 수 없는 서버 에러입니다.`,
      );
    }
  }

  async updateFaq(
    faqNo: number,
    { title, description }: UpdateFaqDto,
    manager: User,
  ): Promise<number> {
    const updateFaqData: object = {
      title,
      description,
      manager,
    };

    try {
      const { affected }: UpdateResult = await this.createQueryBuilder()
        .update(Faq)
        .set(updateFaqData)
        .where('no = :faqNo', { faqNo })
        .execute();

      return affected;
    } catch (err) {
      throw new InternalServerErrorException(
        `${err.message} ### FAQ 업데이트 : 알 수 없는 서버 에러입니다.`,
      );
    }
  }

  async deleteFaq(faqNo: number): Promise<number> {
    try {
      const { affected }: DeleteResult = await this.createQueryBuilder()
        .softDelete()
        .from(Faq)
        .where('no = :faqNo', { faqNo })
        .execute();

      return affected;
    } catch (err) {
      throw new InternalServerErrorException(
        `${err.message} ### FAQ 삭제 : 알 수 없는 서버 에러입니다.`,
      );
    }
  }

  async searchFaqs({ title, take, page }: any): Promise<Faq | Faq[]> {
    try {
      const searchedFaqs: Faq | Faq[] = await this.createQueryBuilder('faqs')
        .select([
          'faqs.no AS no',
          'faqs.title AS title',
          'faqs.description AS description',
        ])
        .where('faqs.title like :title', { title: `%${title}%` })
        .orderBy('faqs.created_at', 'DESC')
        .limit(+take)
        .offset((+page - 1) * +take)
        .getRawMany();

      return searchedFaqs;
    } catch (err) {
      throw new InternalServerErrorException(
        `${err.message} ### FAQ 검색 : 알 수 없는 서버 에러입니다.`,
      );
    }
  }
}
