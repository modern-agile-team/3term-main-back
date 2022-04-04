import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/repository/user.repository';
import { CreateFaqDto, UpdateFaqDto } from './dto/faq.dto';
import { Faq } from './entity/faq.entity';
import { FaqRepository } from './repository/faq.repository';

@Injectable()
export class FaqsService {
  constructor(
    @InjectRepository(FaqRepository)
    private faqRepository: FaqRepository,

    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async findAllFaq(): Promise<Faq[]> {
    const faqs = await this.faqRepository.findAllFaq();

    return faqs;
  }

  async createFaq(createFaqDto: CreateFaqDto) {
    try {
      const { managerNo } = createFaqDto;
      const manager = await this.userRepository.findOne(managerNo, {
        relations: ['faqs'],
      });
      const { affectedRows, insertId } = await this.faqRepository.createFaq(
        createFaqDto,
        manager,
      );
      const faqs = await this.faqRepository.findOne(insertId);

      manager.faqs.push(faqs);

      await this.userRepository.save(manager);

      if (affectedRows) {
        return { success: true };
      }

      return { success: false };
    } catch (e) {
      throw e;
    }
  }

  async updateFaq(no: number, updateFaqDto: UpdateFaqDto) {
    const { modifiedManagerNo } = updateFaqDto;
    const manager = await this.userRepository.findOne(modifiedManagerNo, {
      relations: ['modifyFaqs'],
    });
    const updateResult = this.faqRepository.updateFaq(
      no,
      updateFaqDto,
      manager,
    );
    const faq = await this.faqRepository.findOne(no);

    manager.modifyFaqs.push(faq);

    await this.userRepository.save(manager);

    if (updateResult) {
      return { success: true };
    }

    return { success: false };
  }

  async deleteFaq(no: number) {
    const deleteFaq = await this.faqRepository.deleteFaq(no);

    if (deleteFaq) {
      return { success: true };
    }

    return { success: false };
  }
}
