import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/repository/user.repository';
import { BoardRepository } from 'src/boards/repository/board.repository';
import { ErrorConfirm } from 'src/common/utils/error';
import { Repository } from 'typeorm';
import {
  BoardReportChecksRepository,
  ReportCheckboxRepository,
  UserReportChecksRepository,
} from './repository/report.repository';
import { ReportsService } from './reports.service';
import {
  ReportedBoardRepository,
  ReportedUserRepository,
} from './repository/report.repository';
import { CreateReportDto } from './dto/report.dto';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

const MockReportedBoardRepository = () => ({
  readOneReportedBoard: jest.fn(),
  createBoardReport: jest.fn(),
});
const MockReportedUserRepository = () => ({
  readOneReportedUser: jest.fn(),
  createUserReport: jest.fn(),
  readOneReportUserRelation: jest.fn(),
});
const MockReportCheckboxRepository = () => ({
  readAllCheckboxes: jest.fn(),
  selectCheckConfirm: jest.fn(),
});
const MockBoardReportChecksRepository = () => ({
  saveBoardReportChecks: jest.fn(),
});
const MockUserReportChecksRepository = () => ({
  saveUserReportChecks: jest.fn(),
});

const MockUserRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
});

const MockBoardRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('ReportsService', () => {
  let reportsService: ReportsService;
  let reportedBoardRepository: MockRepository<ReportedBoardRepository>;
  let reportedUserRepository: MockRepository<ReportedUserRepository>;
  let reportCheckboxRepository: MockRepository<ReportCheckboxRepository>;
  let boardReportChecksRepository: MockRepository<BoardReportChecksRepository>;
  let userReportChecksRepository: MockRepository<UserReportChecksRepository>;
  let userRepository: MockRepository<UserRepository>;
  let boardRepository: MockRepository<BoardRepository>;
  let errorConfirm: ErrorConfirm;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        ErrorConfirm,
        {
          provide: getRepositoryToken(ReportedBoardRepository),
          useValue: MockReportedBoardRepository(),
        },
        {
          provide: getRepositoryToken(ReportedUserRepository),
          useValue: MockReportedUserRepository(),
        },
        {
          provide: getRepositoryToken(ReportCheckboxRepository),
          useValue: MockReportCheckboxRepository(),
        },
        {
          provide: getRepositoryToken(BoardReportChecksRepository),
          useValue: MockBoardReportChecksRepository(),
        },
        {
          provide: getRepositoryToken(UserReportChecksRepository),
          useValue: MockUserReportChecksRepository(),
        },
        {
          provide: getRepositoryToken(UserRepository),
          useValue: MockUserRepository(),
        },
        {
          provide: getRepositoryToken(BoardRepository),
          useValue: MockBoardRepository(),
        },
      ],
    }).compile();

    reportsService = module.get<ReportsService>(ReportsService);
    reportedBoardRepository = module.get<
      MockRepository<ReportedBoardRepository>
    >(getRepositoryToken(ReportedBoardRepository));
    reportedUserRepository = module.get<MockRepository<ReportedUserRepository>>(
      getRepositoryToken(ReportedUserRepository),
    );
    reportCheckboxRepository = module.get<
      MockRepository<ReportCheckboxRepository>
    >(getRepositoryToken(ReportCheckboxRepository));
    boardReportChecksRepository = module.get<
      MockRepository<BoardReportChecksRepository>
    >(getRepositoryToken(BoardReportChecksRepository));
    userReportChecksRepository = module.get<
      MockRepository<UserReportChecksRepository>
    >(getRepositoryToken(UserReportChecksRepository));
    userRepository = module.get<MockRepository<UserRepository>>(
      getRepositoryToken(UserRepository),
    );
    boardRepository = module.get<MockRepository<BoardRepository>>(
      getRepositoryToken(BoardRepository),
    );
    errorConfirm = module.get<ErrorConfirm>(ErrorConfirm);
  });

  it('should be defined', () => {
    expect(reportsService).toBeDefined();
  });

  describe('read', () => {
    beforeAll(async () => {
      reportCheckboxRepository['readAllCheckboxes'].mockResolvedValue([
        {
          no: 1,
          content: '욕',
          reportedBoards: [
            {
              no: 1,
              title: 'title',
            },
          ],
          reportedUsers: [
            {
              no: 1,
              name: 'name',
            },
          ],
        },
        {
          no: 2,
          content: '비방',
          reportedBoards: [
            {
              no: 1,
              title: 'title',
            },
          ],
          reportedUsers: [
            {
              no: 1,
              name: 'name',
            },
          ],
        },
      ]);
      reportedBoardRepository['readOneReportedBoard'].mockResolvedValue({
        no: 1,
        reportUser: 1,
        reportedBoard: 5,
        checks: [1, 2, 3],
      });
      reportedUserRepository['readOneReportedUser'].mockResolvedValue({
        no: 1,
        reportUser: 1,
        reportedUser: 5,
        checks: [1, 2, 3],
      });
    });

    it('readAllCheckboxes', async () => {
      const returnValue = await reportsService.readAllCheckboxes();

      expect(returnValue).toStrictEqual([
        {
          no: 1,
          content: '욕',
          reportedBoards: [
            {
              no: 1,
              title: 'title',
            },
          ],
          reportedUsers: [
            {
              no: 1,
              name: 'name',
            },
          ],
        },
        {
          no: 2,
          content: '비방',
          reportedBoards: [
            {
              no: 1,
              title: 'title',
            },
          ],
          reportedUsers: [
            {
              no: 1,
              name: 'name',
            },
          ],
        },
      ]);
    });

    it('readOneReportedBoard', async () => {
      const returnValue = await reportsService.readOneReportedBoard(5);

      expect(returnValue).toStrictEqual({
        no: 1,
        reportUser: 1,
        reportedBoard: 5,
        checks: [1, 2, 3],
      });
    });

    it('readOneReportedUser', async () => {
      const returnValue = await reportsService.readOneReportedUser(5);

      expect(returnValue).toStrictEqual({
        no: 1,
        reportUser: 1,
        reportedUser: 5,
        checks: [1, 2, 3],
      });
    });
  });

  describe('create', () => {
    describe('게시글 신고 생성', () => {
      beforeEach(async () => {
        // 게시글 신고 생성시 필요한 리턴값 지정
        reportCheckboxRepository['selectCheckConfirm'].mockResolvedValue({
          no: 1,
          content: '욕',
        });
        boardRepository.findOne.mockResolvedValue({
          no: 1,
          reports: [],
        });
        userRepository.findOne.mockResolvedValue({
          no: 1,
          boardReport: [],
        });
        reportedBoardRepository['createBoardReport'].mockResolvedValue({
          insertId: 1,
          affectedRows: 1,
        });
        reportedBoardRepository['readOneReportedBoard'].mockResolvedValue({
          no: 1,
          description: '신고된 게시글 내용',
        });
        boardReportChecksRepository[
          'saveBoardReportChecks'
        ].mockResolvedValue();
      });

      it('createReportBoard', async () => {
        const createReportDto: CreateReportDto = {
          head: 'board',
          headNo: 1,
          reportUserNo: 1,
          description: '신고내용',
          checks: [],
        };
        const returnValue = await reportsService.createReport(createReportDto);

        expect(returnValue).toStrictEqual({
          success: true,
          reportNo: 1,
        });
      });

      it('게시글 신고시 게시글이 없을 경우', async () => {
        boardRepository.findOne.mockResolvedValue(undefined);

        const createReportDto: CreateReportDto = {
          head: 'board',
          headNo: 1,
          reportUserNo: 1,
          description: '신고내용',
          checks: [],
        };

        try {
          await reportsService.createReport(createReportDto);
        } catch (e) {
          expect(e).toBeInstanceOf(NotFoundException);
          expect(e.response).toStrictEqual({
            error: 'Not Found',
            message: '신고하려는 게시글이 존재하지 않습니다.',
            statusCode: 404,
          });
        }
      });

      it('게시글 신고 생성시 신고자가 없을 경우', async () => {
        userRepository.findOne.mockResolvedValue(undefined);

        const createReportDto: CreateReportDto = {
          head: 'board',
          headNo: 1,
          reportUserNo: 1,
          description: '신고내용',
          checks: [],
        };

        try {
          await reportsService.createReport(createReportDto);
        } catch (e) {
          expect(e).toBeInstanceOf(NotFoundException);
          expect(e.response).toStrictEqual({
            error: 'Not Found',
            message: '신고자를 찾을 수 없습니다.',
            statusCode: 404,
          });
        }
      });

      it('게시글 신고 저장이 실패했을 경우', async () => {
        reportedBoardRepository['createBoardReport'].mockResolvedValue({
          insertId: 2,
          affectedRows: 0,
        });

        const createReportDto: CreateReportDto = {
          head: 'board',
          headNo: 1,
          reportUserNo: 1,
          description: '신고내용',
          checks: [],
        };

        try {
          await reportsService.createReport(createReportDto);
        } catch (e) {
          expect(e).toBeInstanceOf(InternalServerErrorException);
          expect(e.response).toStrictEqual({
            error: 'Internal Server Error',
            message: '게시글 신고 저장 실패',
            statusCode: 500,
          });
        }
      });
    });

    describe('유저 신고 생성', () => {
      beforeEach(async () => {
        reportCheckboxRepository['selectCheckConfirm'].mockResolvedValue({
          no: 1,
          content: '욕',
        });
        userRepository.findOne.mockResolvedValue({
          no: 1,
          reports: [],
          userReport: [],
        });
        reportedUserRepository['createUserReport'].mockResolvedValue({
          insertId: 1,
          affectedRows: 1,
        });
        reportedUserRepository['readOneReportedUser'].mockResolvedValue({
          no: 1,
          description: '신고된 유저 내용',
        });
        userReportChecksRepository['saveUserReportChecks'].mockResolvedValue();
      });

      it('createReportUser', async () => {
        const createReportDto: CreateReportDto = {
          head: 'user',
          headNo: 1,
          reportUserNo: 1,
          description: '신고내용',
          checks: [],
        };
        const returnValue = await reportsService.createReport(createReportDto);

        expect(returnValue).toStrictEqual({
          success: true,
          reportNo: 1,
        });
      });

      it('유저 신고시 가해자가 없을 경우', async () => {
        userRepository.findOne.mockResolvedValue(undefined);

        const createReportDto: CreateReportDto = {
          head: 'user',
          headNo: 1,
          reportUserNo: 1,
          description: '신고내용',
          checks: [],
        };

        try {
          await reportsService.createReport(createReportDto);
        } catch (e) {
          expect(e).toBeInstanceOf(NotFoundException);
          expect(e.response).toStrictEqual({
            error: 'Not Found',
            message: '신고하려는 유저가 존재하지 않습니다.',
            statusCode: 404,
          });
        }
      });

      // 신고자와 신고당하는 사람을 userRepository.findOne으로 불러와서 이슈 발생;;
      it('유저 신고 생성시 신고자가 없을 경우', async () => {
        userRepository.findOne.mockResolvedValue(undefined);
        const createReportDto: CreateReportDto = {
          head: 'user',
          headNo: 1,
          reportUserNo: 1,
          description: '신고내용',
          checks: [],
        };

        try {
          await reportsService.createReport(createReportDto);
        } catch (e) {
          expect(e).toBeInstanceOf(NotFoundException);
          expect(e.response).toStrictEqual({
            error: 'Not Found',
            message: '신고자를 찾을 수 없습니다.',
            statusCode: 404,
          });
        }
      });

      it('유저 신고 저장이 실패했을 경우', async () => {
        reportedUserRepository['createUserReport'].mockResolvedValue({
          insertId: 2,
          affectedRows: 0,
        });
        const createReportDto: CreateReportDto = {
          head: 'user',
          headNo: 1,
          reportUserNo: 1,
          description: '신고내용',
          checks: [],
        };

        try {
          await reportsService.createReport(createReportDto);
        } catch (e) {
          expect(e).toBeInstanceOf(InternalServerErrorException);
          expect(e.response).toStrictEqual({
            error: 'Internal Server Error',
            message: '유저 신고가 접수되지 않았습니다.',
            statusCode: 500,
          });
        }
      });
    });
  });
});
