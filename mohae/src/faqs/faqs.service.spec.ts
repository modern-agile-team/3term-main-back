import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/repository/user.repository';
import { ErrorConfirm } from 'src/utils/error';
import { Repository } from 'typeorm';
import { Faq } from './entity/faq.entity';
import { FaqsService } from './faqs.service';
import { FaqRepository } from './repository/faq.repository';

// const faqs: Faq[] = [];
const MockFaqRepository = () => ({
  readFaqs: jest.fn(),
});
const MockUserRepository = () => ({
  findOne: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('FaqsService', () => {
  let faqService: FaqsService;
  let faqRepository: MockRepository<FaqRepository>;
  let userRepository: MockRepository<UserRepository>;
  let errorConfirm: ErrorConfirm;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FaqsService,
        ErrorConfirm,
        {
          provide: getRepositoryToken(FaqRepository),
          useValue: MockFaqRepository(),
        },
        {
          provide: getRepositoryToken(UserRepository),
          useValue: MockUserRepository(),
        },
      ],
    }).compile();

    faqService = module.get<FaqsService>(FaqsService);
    faqRepository = module.get<MockRepository<FaqRepository>>(
      getRepositoryToken(FaqRepository),
    );
    userRepository = module.get<MockRepository<UserRepository>>(
      getRepositoryToken(UserRepository),
    );
    errorConfirm = module.get<ErrorConfirm>(ErrorConfirm);
  });

  it('should be defined', () => {
    expect(faqService).toBeDefined();
  });

  describe('readFaqs', () => {
    describe('When readFaqs is called', () => {
      console.log(faqRepository.find.mockResolvedValue([]));
      beforeEach(async () => {
        // faqRepository.find.mockResolvedValue();
        // faqRepository.find
        await faqService.readFaqs();
      });

      it('자주 묻는 질문 전체 조회', async () => {
        expect(faqRepository.find).toHaveBeenCalled();
      });
    });
    // it('모든 자주묻는질문 조회', async () => {
    //   jest
    //     .spyOn(faqRepository, 'findAllFaq')
    //     .mockResolvedValue(Promise.resolve(faqs));

    //   const result = await faqService.findAllFaq();

    //   expect(result).toBeInstanceOf(Array);
    // });
  });
});
