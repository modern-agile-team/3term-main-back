import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Mailbox } from '../entity/mailbox.entity';

@EntityRepository(Mailbox)
export class MailboxRepository extends Repository<Mailbox> {
  async searchMailbox(mailboxNo: number, limit: number): Promise<Mailbox> {
    try {
      const mailbox: Mailbox = await this.createQueryBuilder('mailboxes')
        .leftJoin('mailboxes.mailboxUsers', 'mailboxUsers')
        .leftJoin('mailboxUsers.mailbox', 'mailbox')
        .leftJoin('mailboxUsers.user', 'user')
        .leftJoin('mailboxes.letters', 'letter')
        .limit(limit * 2 + 19)
        .select([
          'mailboxes.no',
          'mailboxUsers.no',
          'mailbox.no',
          'user.no',
          'letter.no',
          'letter.description',
          'letter.reading_flag',
          'letter.createdAt',
        ])
        .where('mailboxes.no = :mailboxNo', { mailboxNo })
        .orderBy('letter.createdAt', 'ASC')
        .getOne();

      return mailbox;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async createMailbox(): Promise<number> {
    try {
      const { raw }: any = await this.createQueryBuilder('mailboxes')
        .insert()
        .into(Mailbox)
        .values({})
        .execute();

      return raw.insertId;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async mailboxAddRelation(
    no: number,
    value: any,
    relation: string,
  ): Promise<void> {
    try {
      await this.createQueryBuilder()
        .relation(Mailbox, relation)
        .of(no)
        .add(value);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
