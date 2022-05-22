import { InternalServerErrorException } from '@nestjs/common';
import { User } from 'src/auth/entity/user.entity';
import { Mailbox } from 'src/mailboxes/entity/mailbox.entity';
import { EntityRepository, Repository } from 'typeorm';
import { MailboxUser } from '../entity/mailbox-user.entity';

@EntityRepository(MailboxUser)
export class MailboxUserRepository extends Repository<MailboxUser> {
  async saveMailboxUser(mailbox: Mailbox, user: User) {
    try {
      const { raw } = await this.createQueryBuilder()
        .insert()
        .into(MailboxUser)
        .values({
          user,
          mailbox,
        })
        .execute();

      return raw.insertId;
    } catch (e) {
      throw new InternalServerErrorException('MailboxUserRepository 에러');
    }
  }

  async mailboxUserRelation(no: number, value: any, relation: string) {
    try {
      await this.createQueryBuilder()
        .relation(MailboxUser, relation)
        .of(no)
        .add(value);
    } catch (e) {
      throw new InternalServerErrorException(
        'MailboxUserRelation 값 추가 에러',
      );
    }
  }

  async searchMailboxUser(oneselfNo: number, opponentNo: number): Promise<any> {
    try {
      const { mailboxNo }: any = await this.createQueryBuilder('firstMU')
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
