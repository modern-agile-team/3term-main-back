import { Test, TestingModule } from '@nestjs/testing';
import { Faq } from './entity/faq.entity';
import { FaqsService } from './faqs.service';
import { FaqRepository } from './repository/faq.repository';

const faqs: Faq[] = [];

describe('FaqsService', () => {
  let faqService: FaqsService;
  let faqRepository: FaqRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FaqsService, FaqRepository],
    }).compile();

    faqService = module.get<FaqsService>(FaqsService);
    faqRepository = module.get<FaqRepository>(FaqRepository);
  });

  it('should be defined', () => {
    expect(faqService).toBeDefined();
  });

  describe('findAllFaq', () => {
    it('모든 자주묻는질문 조회', async () => {
      jest
        .spyOn(faqRepository, 'findAllFaq')
        .mockResolvedValue(Promise.resolve(faqs));

      const result = await faqService.findAllFaq();

      expect(result).toBeInstanceOf(Array);
    });
  });
});
