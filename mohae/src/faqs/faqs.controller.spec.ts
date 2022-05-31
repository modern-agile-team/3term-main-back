import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from 'src/auth/repository/user.repository';
import { ErrorConfirm } from 'src/common/utils/error';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { FaqsController } from './faqs.controller';
import { FaqsService } from './faqs.service';
import { FaqRepository } from './repository/faq.repository';

describe('FaqsController', () => {
  let faqsController: FaqsController;
  let faqsService: FaqsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [FaqsController],
      providers: [FaqsService, FaqRepository, UserRepository, ErrorConfirm],
    })
      .overrideProvider(FaqsService)
      .useValue(faqsService)
      .compile();

    faqsController = module.get<FaqsController>(FaqsController);
    faqsService = module.get<FaqsService>(FaqsService);
  });

  describe('/GET faqs, readFaqs()', () => {
    it('FAQ 전체 조회', async () => {
      faqsService.readAllFaq = jest.fn().mockResolvedValue([
        {
          no: 1,
          title: '제목',
          description: '내용',
        },
        {
          no: 2,
          title: '제목2',
          description: '내용2',
        },
      ]);

      const MockReadFaqs = await faqsService.readAllFaq();
      const response = await faqsController.readAllFaq();

      expect(response).toStrictEqual({
        statusCode: 200,
        msg: '전체 FAQ가 조회되었습니다.',
        response: MockReadFaqs,
      });
    });
  });

  describe('/POST faqs, createFaq()', () => {
    it('FAQ 생성 요청', async () => {
      faqsService.createFaq = jest.fn().mockResolvedValue({
        success: true,
      });
      const createFaqDto: CreateFaqDto = {
        title: 'test',
        managerNo: 1,
        description: 'test',
      };
      const MockCreateFaq = await faqsService.createFaq(createFaqDto);
      const response = await faqsController.createFaq(createFaqDto);

      expect(response).toStrictEqual({
        statusCode: 201,
        msg: 'FAQ 생성 완료',
        response: MockCreateFaq,
      });
    });
    it.todo('매니저가 아닌 경우');
    it.todo('제목 길이가 벗어난 경우');
    it.todo('내용 길이가 벗어난 경우');
  });

  describe('/PATCH faqs/:faqNo, updateFaq()', () => {
    it('FAQ 수정 요청', async () => {
      faqsService.updateFaq = jest.fn().mockResolvedValue({
        success: true,
      });
      const faqNo = 1;
      const updateFaqDto: UpdateFaqDto = {
        title: 'test',
        managerNo: 1,
        description: 'test',
      };
      const MockupdateFaq = await faqsService.updateFaq(faqNo, updateFaqDto);
      const response = await faqsController.updateFaq(faqNo, updateFaqDto);

      expect(response).toStrictEqual({
        statusCode: 201,
        msg: 'FAQ 수정 완료',
        response: MockupdateFaq,
      });
    });
  });

  describe('/DELETE faqs/:faqNo, deleteFaq()', () => {
    it('FAQ 삭제 요청', async () => {
      faqsService.deleteFaq = jest.fn().mockResolvedValue({
        success: true,
      });
      const faqNo = 1;
      const MockdeleteFaq = await faqsService.deleteFaq(faqNo);
      const response = await faqsController.deleteFaq(faqNo);

      expect(response).toStrictEqual({
        statusCode: 200,
        msg: 'FAQ 삭제 완료',
        response: MockdeleteFaq,
      });
    });
  });
});
