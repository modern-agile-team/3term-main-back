import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entity/user.entity';
import { UserRepository } from 'src/auth/repository/user.repository';
import { ErrorConfirm } from 'src/common/utils/error';
import { Connection, QueryRunner } from 'typeorm';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { Faq } from './entity/faq.entity';
import { FaqRepository } from './repository/faq.repository';

@Injectable()
export class FaqsService {
  constructor(
    @InjectRepository(FaqRepository)
    private faqRepository: FaqRepository,

    private userRepository: UserRepository,

    private connection: Connection,
    private errorConfirm: ErrorConfirm,
  ) {}

  async readAllFaqs(): Promise<Faq | Faq[]> {
    try {
      const faqs = await this.faqRepository.readAllFaqs();
      this.errorConfirm.notFoundError(faqs, '자주 묻는 질문이 없습니다.');

      return faqs;
    } catch (err) {
      throw err;
    }
  }

  async createFaq(manager: User, createFaqDto: CreateFaqDto): Promise<void> {
    const queryRunner: QueryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { affectedRows, insertId }: any = await queryRunner.manager
        .getCustomRepository(FaqRepository)
        .createFaq(createFaqDto, manager);

      this.errorConfirm.badGatewayError(affectedRows, 'FAQ 생성 실패');

      await queryRunner.manager
        .getCustomRepository(UserRepository)
        .userRelation(manager.no, insertId, 'faqs');
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async updateFaq(
    manager: User,
    faqNo: number,
    updateFaqDto: UpdateFaqDto,
  ): Promise<void> {
    const queryRunner: any = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const updatedResult: number = await queryRunner.manager
        .getCustomRepository(FaqRepository)
        .updateFaq(faqNo, updateFaqDto, manager);

      this.errorConfirm.badGatewayError(updatedResult, 'FAQ 수정 실패');

      await queryRunner.manager
        .getCustomRepository(UserRepository)
        .userRelation(manager.no, faqNo, 'modifiedFaqs');
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteFaq(faqNo: number): Promise<void> {
    try {
      const deletedResult: number = await this.faqRepository.deleteFaq(faqNo);

      this.errorConfirm.badGatewayError(deletedResult, 'FAQ 삭제 실패');
    } catch (err) {
      throw err;
    }
  }
}
