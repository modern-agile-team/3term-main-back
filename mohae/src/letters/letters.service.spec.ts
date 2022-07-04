import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/repository/user.repository';
import {
  MailboxRepository,
  MailboxUserRepository,
} from 'src/mailboxes/repository/mailbox.repository';
import { ErrorConfirm } from 'src/common/utils/error';
import { Repository } from 'typeorm';
import { SendLetterDto } from './dto/letter.dto';
import { LettersService } from './letters.service';
import { LetterRepository } from './repository/letter.repository';

const MockMailboxRepository = () => ({
  createMailbox: jest.fn(),
  searchMailbox: jest.fn(),
  mailboxRelation: jest.fn(),
});
const MockUserRepository = () => ({
  findOne: jest.fn(),
  userRelation: jest.fn(),
});
const MockLetterRepository = () => ({
  sendLetter: jest.fn(),
});
const MockMailboxUserRepository = () => ({
  saveMailboxUser: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('LettersService', () => {
  let lettersService: LettersService;
  let letterRepository: MockRepository<LetterRepository>;
  let userRepository: MockRepository<UserRepository>;
  let mailboxRepository: MockRepository<MailboxRepository>;
  let mailboxUserRepository: MockRepository<MailboxUserRepository>;
  let errorConfirm: ErrorConfirm;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LettersService,
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

    lettersService = module.get<LettersService>(LettersService);
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

  describe('쪽지 전송시 내용 저장', () => {
    it('sendLetter. CASE 1 mailboxNo === null', async () => {
      mailboxRepository['createMailbox'].mockResolvedValue(1);
      userRepository.findOne.mockResolvedValue(1);
      mailboxRepository['searchMailbox'].mockResolvedValue({
        no: 1,
        userNo: [1, 2],
        letterNo: 1,
        letterDescription: '내용',
      });
      letterRepository['sendLetter'].mockResolvedValue({
        insertId: 1,
        affectedRows: 1,
      });
      mailboxUserRepository['saveMailboxUser'].mockResolvedValue(1);

      const mailboxRelation = mailboxRepository['mailboxRelation'];
      const userRelation = userRepository['userRelation'];
      const sendLetterDto: SendLetterDto = {
        senderNo: 1,
        receiverNo: 2,
        mailboxNo: null,
        description: '테스트 쪽지',
      };

      const resultValue = await lettersService.sendLetter(sendLetterDto);

      expect(resultValue).toStrictEqual({ success: true });
      expect(userRelation).toHaveBeenCalledTimes(4);
      expect(mailboxRelation).toHaveBeenCalledTimes(3);
    });
  });
});
