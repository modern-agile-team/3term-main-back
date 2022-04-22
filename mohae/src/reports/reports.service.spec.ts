import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/repository/user.repository';
import { BoardRepository } from 'src/boards/repository/board.repository';
import { ErrorConfirm } from 'src/utils/error';
import { Repository } from 'typeorm';
import { ReportCheckboxRepository } from './repository/report.repository';
import { ReportsService } from './reports.service';
import {
  ReportedBoardRepository,
  ReportedUserRepository,
} from './repository/report.repository';

const MockReportedBoardRepository = () => ({});
const MockReportedUserRepository = () => ({});
const MockReportCheckboxRepository = () => ({
  readAllCheckboxes: jest.fn(),
});

const MockUserRepository = () => ({
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
  let userRepository: MockRepository<UserRepository>;
  let boardRepository: MockRepository<BoardRepository>;
  let errorConfirm: ErrorConfirm;

  beforeEach(async () => {
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

  describe('Checkboxes', () => {
    it('readAllCheckboxes', async () => {
      reportCheckboxRepository['readAllCheckboxes'].mockResolvedValue([
        {
          no: 1,
          name: '내용',
        },
        {
          no: 2,
          name: '내용2',
        },
        {
          no: 3,
          name: '내용3',
        },
      ]);

      const returnValue = await reportsService.readAllCheckboxes();
      expect(returnValue).toStrictEqual([
        {
          no: 1,
          name: '내용',
        },
        {
          no: 2,
          name: '내용2',
        },
        {
          no: 3,
          name: '내용3',
        },
      ]);
    });
  });
});
