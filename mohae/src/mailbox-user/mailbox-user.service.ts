import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailboxUserRepository } from './repository/mailbox.repository';

@Injectable()
export class MailboxUserService {
  constructor(
    @InjectRepository(MailboxUserRepository)
    private readonly mailboxUserRepository: MailboxUserRepository,
  ) {}
}
