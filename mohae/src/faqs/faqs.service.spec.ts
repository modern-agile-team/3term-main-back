import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/repository/user.repository';
import { ErrorConfirm } from 'src/utils/error';
import { Repository } from 'typeorm';
import { CreateFaqDto } from './dto/faq.dto';
import { Faq } from './entity/faq.entity';
import { FaqsService } from './faqs.service';
import { FaqRepository } from './repository/faq.repository';

const MockFaqRepository = () => ({
  findOne: jest.fn(),
  readFaqs: jest.fn(),
  createFaq: jest.fn(),
  updateFaq: jest.fn(),
});
const MockUserRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
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

  describe('readFaqs', () => {
    beforeEach(async () => {
      faqRepository['readFaqs'].mockResolvedValue([
        {
          no: 1,
          title: '타이틀',
          description: '내용',
        },
      ]);

      await faqService.readFaqs();
    });
    it('FAQ 전체 읽어 오기', async () => {
      expect(faqRepository['readFaqs']).toHaveBeenCalled();
    });

    it('FAQ가 하나도 없을 때', async () => {
      faqRepository['readFaqs'].mockResolvedValue(undefined);

      try {
        await faqService.readFaqs();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('createFaq', () => {
    beforeEach(async () => {
      // userRepository에 가상 유저 데이터
      userRepository['findOne'].mockResolvedValue({
        no: 1,
        name: 'test',
        faqs: [],
      });

      // faqRepository 내에 있는 createFaq 가상 리턴값
      faqRepository['createFaq'].mockResolvedValue({
        affectedRows: 1,
        insertId: 1,
      });
    });

    it('FAQ 생성', async () => {
      // createFaq Dto로 들어가는 값
      const { success } = await faqService.createFaq({
        managerNo: 1,
        title: 'title',
        description: 'desc',
      });

      // 리턴된 값이 true를 기대
      expect(success).toBeTruthy();
    });
  });

  describe('updateFaq', () => {
    beforeEach(async () => {
      // userRepository에 가상 유저 데이터
      userRepository['findOne'].mockResolvedValue({
        no: 1,
        name: '운영자1',
        modifyFaqs: [],
      });

      // faqRepository 내에 있는 createFaq 가상 리턴값
      faqRepository['updateFaq'].mockResolvedValue(1);
    });
    it('FAQ 수정', async () => {
      const { success } = await faqService.updateFaq(1, {
        title: '제목',
        modifiedManagerNo: 1,
        description: '내용',
      });

      expect(success).toBeTruthy();
    });
  });
});
