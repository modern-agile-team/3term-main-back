import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from 'src/auth/repository/user.repository';
import { BoardRepository } from 'src/boards/repository/board.repository';
import { ErrorConfirm } from 'src/utils/error';
import { CreateReportDto } from './dto/report.dto';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import {
  BoardReportChecksRepository,
  ReportCheckboxRepository,
  ReportedBoardRepository,
  ReportedUserRepository,
  UserReportChecksRepository,
} from './repository/report.repository';

describe('ReportsController', () => {
  let reportsController: ReportsController;
  let reportsService: ReportsService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [ReportsController],
      providers: [
        ReportsService,
        ReportedUserRepository,
        ReportedBoardRepository,
        ReportCheckboxRepository,
        BoardRepository,
        UserRepository,
        BoardReportChecksRepository,
        UserReportChecksRepository,
        ErrorConfirm,
      ],
    }).compile();

    reportsController = module.get<ReportsController>(ReportsController);
    reportsService = module.get<ReportsService>(ReportsService);
  });

  it('should be defined', () => {
    expect(reportsController).toBeDefined();
  });

  describe('/GET', () => {
    it('readAllCheckboxes', async () => {
      reportsService.readAllCheckboxes = jest.fn().mockResolvedValue([
        {
          no: 1,
          content: '욕설',
        },
        {
          no: 2,
          content: '도배',
        },
        {
          no: 3,
          content: '비방',
        },
      ]);

      const MockReadAllCheckboxes = await reportsService.readAllCheckboxes();
      const response = await reportsController.readAllCheckboxes();

      expect(response).toStrictEqual({
        statusCode: 200,
        msg: '체크 항목별 조회되었습니다.',
        response: MockReadAllCheckboxes,
      });
    });
  });

  describe('/GET param', () => {
    it('readOneReportedBoard', async () => {
      reportsService.readOneReportedBoard = jest.fn().mockResolvedValue({
        no: 1,
        description: '게시글 신고 조회 테스트',
      });

      const boardReportNo = 1;
      const MockReadOneReportedBoard =
        await reportsService.readOneReportedBoard(boardReportNo);
      const response = await reportsController.readOneReportedBoard(
        boardReportNo,
      );

      expect(response).toStrictEqual({
        statusCode: 200,
        msg: `No:${boardReportNo} 신고 내역(게시글)이 조회되었습니다.`,
        response: MockReadOneReportedBoard,
      });
    });

    it('readOneReportedUser', async () => {
      reportsService.readOneReportedUser = jest.fn().mockResolvedValue({
        no: 1,
        description: '유저 신고 조회 테스트',
      });

      const userReportNo = 1;
      const MockReadOneReportedUser = await reportsService.readOneReportedUser(
        userReportNo,
      );
      const response = await reportsController.readOneReportedUser(
        userReportNo,
      );

      expect(response).toStrictEqual({
        statusCode: 200,
        msg: `No:${userReportNo} 신고 내역(유저)이 조회되었습니다.`,
        response: MockReadOneReportedUser,
      });
    });
  });

  describe('/POST', () => {
    it('createReport - board', async () => {
      reportsService.createReport = jest.fn().mockResolvedValue({
        success: true,
        reportId: 1,
      });

      const createReportDto: CreateReportDto = {
        head: 'board',
        headNo: 1,
        description: '내용',
        reportUserNo: 1,
        checks: [1, 2, 3],
      };
      const MockCreateReport = await reportsService.createReport(
        createReportDto,
      );
      const response = await reportsController.createReport(createReportDto);

      expect(response).toStrictEqual({
        statusCode: 201,
        msg: `${createReportDto.head} 신고가 접수되었습니다.`,
        response: MockCreateReport,
      });
    });

    it('createReport - user', async () => {
      reportsService.createReport = jest.fn().mockResolvedValue({
        success: true,
        reportId: 1,
      });

      const createReportDto: CreateReportDto = {
        head: 'user',
        headNo: 1,
        description: '내용',
        reportUserNo: 1,
        checks: [1, 2, 3],
      };
      const MockCreateReport = await reportsService.createReport(
        createReportDto,
      );
      const response = await reportsController.createReport(createReportDto);

      expect(response).toStrictEqual({
        statusCode: 201,
        msg: `${createReportDto.head} 신고가 접수되었습니다.`,
        response: MockCreateReport,
      });
    });
  });
  it.todo('일하자');
});
