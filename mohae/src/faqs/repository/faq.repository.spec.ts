import { FaqRepository } from './faq.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/repository/user.repository';
import { CreateFaqDto } from '../dto/faq.dto';
import { Faq } from '../entity/faq.entity';

const MockFaq = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

type MockFaq<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('FaqsController', () => {
  let faqRepository: FaqRepository;
  let faqEntity: MockFaq<Faq>;
  let userRepository: UserRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FaqRepository,
        { provide: getRepositoryToken(Faq), useValue: MockFaq() },
        UserRepository,
      ],
    }).compile();

    faqRepository = module.get<FaqRepository>(FaqRepository);
    userRepository = module.get<UserRepository>(UserRepository);
    faqEntity = module.get(getRepositoryToken(Faq));
  });

  describe('readFaqs', () => {
    beforeEach(async () => {
      faqEntity.find.mockResolvedValue({
        no: 1,
        title: '제목',
        description: '내용',
      });

      faqEntity.create.mockResolvedValue({ affectedRows: 1 });
      console.log(await faqRepository.readFaqs());
    });
    it.todo('FAQ 전체 읽어 오기');

    it.todo('FAQ 생성');
  });
});
