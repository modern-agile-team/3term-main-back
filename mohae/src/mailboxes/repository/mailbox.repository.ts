import { InternalServerErrorException } from '@nestjs/common';
import { User } from 'src/auth/entity/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Mailbox, MailboxUser } from '../entity/mailbox.entity';

@EntityRepository(Mailbox)
export class MailboxRepository extends Repository<Mailbox> {
  async searchMailbox(mailboxNo: number, limit: number) {
    try {
      const mailbox = await this.createQueryBuilder('mailboxes')
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
    } catch (e) {
      throw new InternalServerErrorException(
        '### 쪽지함이 있는지 찾음 : 알 수 없는 서버 에러입니다.',
      );
    }
  }

  async createMailbox() {
    try {
      const { raw } = await this.createQueryBuilder('mailboxes')
        .insert()
        .into(Mailbox)
        .values({})
        .execute();

      return raw.insertId;
    } catch {
      throw new InternalServerErrorException(
        '### 새로운 쪽지방을 생성 : 알 수 없는 서버 에러입니다.',
      );
    }
  }

  async mailboxRelation(no: number, value: any, relation: string) {
    try {
      await this.createQueryBuilder()
        .relation(Mailbox, relation)
        .of(no)
        .add(value);
    } catch (e) {
      throw new InternalServerErrorException('MailboxRelation 값 추가 에러');
    }
  }
}

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

  async serachMailboxUser(oneselfNo, opponentNo) {
    try {
      const mailboxNo = await this.query(
        `SELECT firstMU.mailboxNo FROM mailbox_user firstMU 
        INNER JOIN mailbox_user secondMU 
        ON firstMU.mailboxNo = secondMU.mailboxNo 
        WHERE firstMU.userNo = ${oneselfNo} AND secondMU.userNo = ${opponentNo}`,
      );

      return mailboxNo[0];
    } catch {
      throw new InternalServerErrorException('메일박스유저 서치 오류');
    }
  }
}
