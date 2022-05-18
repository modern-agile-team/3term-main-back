import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from 'src/auth/repository/user.repository';
import { LetterRepository } from 'src/letters/repository/letter.repository';
import { ErrorConfirm } from 'src/common/utils/error';
import { MailboxesController } from './mailboxes.controller';
import { MailboxesService } from './mailboxes.service';
import {
  MailboxRepository,
  MailboxUserRepository,
} from './repository/mailbox.repository';

describe('MailboxesController', () => {
  let mailboxesController: MailboxesController;
  let mailboxesService: MailboxesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [MailboxesController],
      providers: [
        MailboxesService,
        MailboxRepository,
        UserRepository,
        ErrorConfirm,
        MailboxUserRepository,
        LetterRepository,
      ],
    }).compile();

    mailboxesController = module.get<MailboxesController>(MailboxesController);
    mailboxesService = module.get<MailboxesService>(MailboxesService);
  });

  describe('쪽지함 Controller', () => {
    describe('/GET mailboxes', () => {
      it('searchMailbox', async () => {
        mailboxesService.searchMailbox = jest.fn().mockResolvedValue({
          no: 1,
        });

        const response = await mailboxesController.searchMailbox(1, 10);

        expect(response).toStrictEqual({
          statusCode: 200,
          msg: '쪽지 전송 화면 조회 완료',
          response: {
            no: 1,
          },
        });
      });

      it('checkMailbox', async () => {
        mailboxesService.checkMailbox = jest.fn().mockResolvedValue({
          success: true,
          mailboxNo: 1,
        });
        mailboxesService.searchMailbox = jest.fn().mockResolvedValue({
          no: 1,
        });

        const response = await mailboxesController.checkMailbox(1, 2);

        expect(response).toStrictEqual({
          statusCode: 200,
          msg: '쪽지함 존재 여부 확인 완료',
          response: {
            no: 1,
          },
        });
      });
    });
  });
});
