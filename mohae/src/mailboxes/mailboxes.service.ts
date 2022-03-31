import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailboxRepository } from './repository/mailbox.repository';

@Injectable()
export class MailboxesService {
  constructor(
    @InjectRepository(MailboxRepository)
    private mailboxRepository: MailboxRepository,
  ) {}

  async searchMailboxList(no: number) {
    const mailboxList = await this.mailboxRepository.searchMailboxList(no);

    return mailboxList;
  }
}
