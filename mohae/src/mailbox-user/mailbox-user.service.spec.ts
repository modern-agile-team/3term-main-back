import { Test, TestingModule } from '@nestjs/testing';
import { MailboxUserService } from './mailbox-user.service';

describe('MailboxUserService', () => {
  let service: MailboxUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailboxUserService],
    }).compile();

    service = module.get<MailboxUserService>(MailboxUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
