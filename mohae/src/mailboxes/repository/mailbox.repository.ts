import { EntityRepository, Repository } from 'typeorm';
import { Mailbox } from '../entity/mailbox.entity';

@EntityRepository(Mailbox)
export class MailboxRepository extends Repository<Mailbox> {
  async searchMailboxList(no: number) {
    const mailboxList = 23;

    return mailboxList;
  }
}
