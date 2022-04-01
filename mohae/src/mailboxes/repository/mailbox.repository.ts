import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Mailbox } from '../entity/mailbox.entity';

@EntityRepository(Mailbox)
export class MailboxRepository extends Repository<Mailbox> {
  async findAllMailboxes(no: number) {
    const mailbox = await this.createQueryBuilder('mailboxes')
      .leftJoinAndSelect('mailboxes.users', 'users')
      .leftJoinAndSelect('mailboxes.letters', 'letters')
      .leftJoinAndSelect('letters.sender', 'sender')
      .leftJoinAndSelect('letters.receiver', 'receiver')
      .where('users.no = :no', { no })
      .getMany();

    return mailbox;
  }

  async searchMailbox(myNo, yourNo) {
    try {
      const mailbox = await this.createQueryBuilder('mailboxes')
        .leftJoinAndSelect('mailboxes.users', 'users')
        .select(['mailboxes.no', 'users.no'])
        .getMany();

      for (const user of mailbox) {
        const { users } = user;
        if (!users[0] || !users[1]) {
          return 0;
        }

        if (users[0].no === myNo || users[1].no === myNo) {
          if (users[0].no === yourNo || users[1].no === yourNo) {
            return user.no;
          }
        }
      }

      return 0;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async createMailbox() {
    const newMailbox = await this.createQueryBuilder('mailboxes')
      .insert()
      .into(Mailbox)
      .values({ users: [] })
      .execute();
    const { insertId } = newMailbox.raw;

    return insertId;
  }

  async findOneMailbox(mailboxNo: number) {
    const mailbox = await this.createQueryBuilder('mailboxes')
      .leftJoinAndSelect('mailboxes.users', 'users')
      .leftJoinAndSelect('mailboxes.letters', 'letters')
      .getMany();

    return mailbox;
  }
}
