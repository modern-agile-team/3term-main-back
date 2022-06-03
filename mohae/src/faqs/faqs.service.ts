import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entity/user.entity';
import { UserRepository } from 'src/auth/repository/user.repository';
import { ErrorConfirm } from 'src/common/utils/error';
import { Connection } from 'typeorm';
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

    private readonly connection: Connection,
    private errorConfirm: ErrorConfirm,
  ) {}

  async readAllFaqs(): Promise<Faq | Faq[]> {
    try {
      const faqs = await this.faqRepository.readAllFaqs();
      this.errorConfirm.notFoundError(faqs, '자주 묻는 질문이 없습니다.');

      return faqs;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async createFaq(createFaqDto: CreateFaqDto, manager: User): Promise<boolean> {
    const queryRunner: any = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { affectedRows, insertId }: any = await queryRunner.manager
        .getCustomRepository(FaqRepository)
        .createFaq(createFaqDto, manager);

      await queryRunner.manager
        .getCustomRepository(UserRepository)
        .userRelation(manager.no, insertId, 'faqs');

      if (!affectedRows) {
        throw new BadGatewayException('FAQ 생성 실패');
      }

      await queryRunner.commitTransaction();
      return true;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async updateFaq(
    faqNo: number,
    updateFaqDto: UpdateFaqDto,
    manager: User,
  ): Promise<boolean> {
    const queryRunner: any = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const updateResult: number = await queryRunner.manager
        .getCustomRepository(FaqRepository)
        .updateFaq(faqNo, updateFaqDto, manager);

      await queryRunner.manager
        .getCustomRepository(UserRepository)
        .userRelation(manager.no, faqNo, 'modifiedFaqs');

      if (!updateResult) {
        throw new BadGatewayException('FAQ 수정 실패');
      }

      await queryRunner.commitTransaction();
      return true;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteFaq(faqNo: number): Promise<boolean> {
    try {
      const deleteResult: number = await this.faqRepository.deleteFaq(faqNo);

      if (!deleteResult) {
        throw new BadGatewayException('FAQ 수정 실패');
      }

      return true;
    } catch (err) {
      throw err;
    }
  }
}
