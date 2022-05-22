import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/repository/user.repository';
import { ErrorConfirm } from 'src/common/utils/error';
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
    private errorConfirm: ErrorConfirm,
  ) {}

  async readAllFaq(): Promise<Faq | Faq[]> {
    try {
      const faqs = await this.faqRepository.readAllFaq();
      this.errorConfirm.notFoundError(faqs, '자주 묻는 질문이 없습니다.');

      return faqs;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async createFaq(createFaqDto: CreateFaqDto) {
    try {
      const { managerNo } = createFaqDto;
      const manager = await this.userRepository.findOne(managerNo, {
        relations: ['faqs'],
      });
      this.errorConfirm.notFoundError(
        manager,
        '해당 매니저를 찾을 수 없습니다.',
      );
      const { affectedRows, insertId } = await this.faqRepository.createFaq(
        createFaqDto,
        manager,
      );
      const faq = await this.faqRepository.findOne(insertId);

      manager.faqs.push(faq);

      await this.userRepository.save(manager);

      if (affectedRows) {
        return { success: true };
      }

      return { success: false, msg: '해당 FAQ가 생성되지 않았습니다.' };
    } catch (e) {
      throw e;
    }
  }

  async updateFaq(no: number, updateFaqDto: UpdateFaqDto) {
    const { managerNo } = updateFaqDto;

    try {
      const manager = await this.userRepository.findOne(managerNo, {
        relations: ['modifiedFaqs'],
      });
      this.errorConfirm.notFoundError(
        manager,
        '해당 매니저를 찾을 수 없습니다.',
      );
      const updateResult = this.faqRepository.updateFaq(
        no,
        updateFaqDto,
        manager,
      );
      const faq = await this.faqRepository.findOne(no);

      manager.modifiedFaqs.push(faq);

      await this.userRepository.save(manager);

      if (updateResult) {
        return { success: true };
      }

      return { success: false };
    } catch (e) {
      throw e;
    }
  }

  async deleteFaq(no: number) {
    try {
      const deleteResult = await this.faqRepository.deleteFaq(no);

      if (deleteResult) {
        return { success: true };
      }

      return { success: false };
    } catch (e) {
      throw e;
    }
  }
}
