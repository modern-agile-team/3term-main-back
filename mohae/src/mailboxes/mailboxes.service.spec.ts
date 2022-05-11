import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/repository/user.repository';
import { LetterRepository } from 'src/letters/repository/letter.repository';
import { ErrorConfirm } from 'src/utils/error';
import { Repository } from 'typeorm';
import { MailboxesService } from './mailboxes.service';
import {
  MailboxRepository,
  MailboxUserRepository,
} from './repository/mailbox.repository';

const MockMailboxRepository = () => ({
  readAllMailboxes: jest.fn(),
  searchMailbox: jest.fn(),
  checkMailbox: jest.fn(),
});
const MockUserRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
});
const MockLetterRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  notReadingLetter: jest.fn(),
  updateReading: jest.fn(),
});
const MockMailboxUserRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  searchMailboxUser: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('MailboxesService', () => {
  let mailboxesService: MailboxesService;
  let mailboxRepository: MockRepository<MailboxRepository>;
  let userRepository: MockRepository<UserRepository>;
  let letterRepository: MockRepository<LetterRepository>;
  let mailboxUserRepository: MockRepository<MailboxUserRepository>;
  let errorConfirm: ErrorConfirm;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailboxesService,
        ErrorConfirm,
        {
          provide: getRepositoryToken(MailboxRepository),
          useValue: MockMailboxRepository(),
        },
        {
          provide: getRepositoryToken(UserRepository),
          useValue: MockUserRepository(),
        },
        {
          provide: getRepositoryToken(LetterRepository),
          useValue: MockLetterRepository(),
        },
        {
          provide: getRepositoryToken(MailboxUserRepository),
          useValue: MockMailboxUserRepository(),
        },
      ],
    }).compile();

    mailboxesService = module.get<MailboxesService>(MailboxesService);
    mailboxRepository = module.get<MockRepository<MailboxRepository>>(
      getRepositoryToken(MailboxRepository),
    );
    userRepository = module.get<MockRepository<UserRepository>>(
      getRepositoryToken(UserRepository),
    );
    letterRepository = module.get<MockRepository<LetterRepository>>(
      getRepositoryToken(LetterRepository),
    );
    mailboxUserRepository = module.get<MockRepository<MailboxUserRepository>>(
      getRepositoryToken(MailboxUserRepository),
    );
    errorConfirm = module.get<ErrorConfirm>(ErrorConfirm);
  });

  it('should be defined', () => {
    expect(mailboxesService).toBeDefined();
  });

  describe('쪽지함 기능 테스트', () => {
    describe('쪽지함 조회', () => {
      it.todo('readAllMailboxes');
      it('searchMailbox', async () => {
        mailboxRepository['searchMailbox'].mockResolvedValue({
          no: 1,
          mailboxUsers: [
            {
              no: 1,
            },
            {
              no: 2,
            },
          ],
          letters: [
            {
              no: 1,
              content: '쪽지 테스트',
              reading_flag: true,
              senderNo: 1,
              receiverNo: 2,
            },
            {
              no: 2,
              content: '쪽지 테스트2',
              reading_flag: true,
              senderNo: 2,
              receiverNo: 1,
            },
          ],
        });
        letterRepository['notReadingLetter'].mockResolvedValue([
          {
            no: 1,
            reading_flag: false,
          },
          {
            no: 2,
            reading_flag: false,
          },
        ]);
        letterRepository['updateReading'].mockResolvedValue(1);

        const mailboxNo = 1;
        const limit = 10;
        const resultValue = await mailboxesService.searchMailbox(
          mailboxNo,
          limit,
        );

        expect(resultValue).toStrictEqual({
          no: 1,
          mailboxUsers: [
            {
              no: 1,
            },
            {
              no: 2,
            },
          ],
          letters: [
            {
              no: 1,
              content: '쪽지 테스트',
              reading_flag: true,
              senderNo: 1,
              receiverNo: 2,
            },
            {
              no: 2,
              content: '쪽지 테스트2',
              reading_flag: true,
              senderNo: 2,
              receiverNo: 1,
            },
          ],
        });
      });

      it('checkMailbox', async () => {
        mailboxUserRepository['searchMailboxUser'].mockResolvedValue({
          mailboxNo: 1,
        });
        const oneselfNo = 1;
        const opponentNo = 2;

        const resultValue = await mailboxesService.checkMailbox(
          oneselfNo,
          opponentNo,
        );

        expect(resultValue).toStrictEqual({
          success: true,
          mailboxNo: 1,
        });
      });
    });
  });
});
