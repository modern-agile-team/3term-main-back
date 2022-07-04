import { InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entity/user.entity';
import { Mailbox } from 'src/mailboxes/entity/mailbox.entity';
import { EntityRepository, InsertResult, Repository } from 'typeorm';
import { MailboxUser } from '../entity/mailbox-user.entity';

@EntityRepository(MailboxUser)
export class MailboxUserRepository extends Repository<MailboxUser> {
  async saveMailboxUser(mailbox: Mailbox, user: User): Promise<MailboxUser> {
    try {
      const { raw }: InsertResult = await this.createQueryBuilder()
        .insert()
        .into(MailboxUser)
        .values({
          user,
          mailbox,
        })
        .execute();

      return raw.insertId;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async searchMailboxUser(oneselfNo: number, opponentNo: number): Promise<any> {
    try {
      const mailboxNo: MailboxUser = await this.createQueryBuilder('firstMU')
        .innerJoin('firstMU.mailbox', 'innerMailbox')
        .innerJoin(
          'innerMailbox.mailboxUsers',
          'secondMU',
          'firstMU.mailbox = secondMU.mailbox',
        )
        .select(['firstMU.mailbox AS mailboxNo'])
        .where('firstMU.user = :oneselfNo AND secondMU.user = :opponentNo', {
          oneselfNo,
          opponentNo,
        })
        .getRawOne();

      return mailboxNo;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
