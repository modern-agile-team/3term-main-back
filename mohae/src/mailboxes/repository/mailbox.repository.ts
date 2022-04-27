import { InternalServerErrorException } from '@nestjs/common';
import { User } from 'src/auth/entity/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Mailbox, MailboxUser } from '../entity/mailbox.entity';

@EntityRepository(Mailbox)
export class MailboxRepository extends Repository<Mailbox> {
  async searchMailbox(mailboxNo: number, limit: number) {
    try {
      const mailbox = await this.createQueryBuilder('mailboxes')
        .leftJoin('mailboxes.users', 'users')
        .leftJoin('mailboxes.letters', 'letter')
        .limit(limit * 2 + 19)
        .select([
          'mailboxes.no',
          'users.no',
          'users.nickname',
          'users.photo_url',
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
      const newMailbox = await this.createQueryBuilder('mailboxes')
        .insert()
        .into(Mailbox)
        .values({})
        .execute();
      const { insertId } = newMailbox.raw;

      return insertId;
    } catch {
      throw new InternalServerErrorException(
        '### 새로운 쪽지방을 생성 : 알 수 없는 서버 에러입니다.',
      );
    }
  }

  async findOneMailbox(mailboxNo: number) {
    try {
      const mailbox = await this.createQueryBuilder('mailboxes')
        .leftJoinAndSelect('mailboxes.users', 'users')
        .leftJoinAndSelect('mailboxes.letters', 'letters')
        .where('mailboxes.no = :mailboxNo', { mailboxNo })
        .getMany();

      return mailbox;
    } catch {
      throw new InternalServerErrorException(
        '### 쪽지함 : 알 수 없는 서버 에러입니다.',
      );
    }
  }

  async checkMailbox(oneselfNo: number, opponentNo: number) {
    try {
      // const mailbox = await this.createQueryBuilder('mailboxes')
      //   .leftJoinAndSelect(
      //     'mailboxes.users',
      //     'user',
      //     'user.no = :oneselfNo AND user.no = :opponentNo',
      //     {
      //       oneselfNo,
      //       opponentNo,
      //     },
      //   )
      //   .leftJoinAndSelect('mailboxes.letters', 'letter')
      //   .select([
      //     'mailboxes.no',
      //     'user.no',
      //     'user.nickname',
      //     'letter.no',
      //     'letter.description',
      //     'letter.reading_flag',
      //     'letter.createdAt',
      //   ])
      //   .getOne();
      // return mailbox;
    } catch (e) {
      throw new InternalServerErrorException(
        '### 쪽지함 여부 확인 : 알 수 없는 서버 에러입니다.',
      );
    }
  }
}

@EntityRepository(MailboxUser)
export class MailboxUserRepository extends Repository<MailboxUser> {
  async saveMailboxUser(mailbox: Mailbox, user: User) {
    try {
      await this.createQueryBuilder('board_report_checks')
        .insert()
        .into(MailboxUser)
        .values({ mailbox, user })
        .execute();
    } catch (e) {
      throw new InternalServerErrorException('MailboxUserRepository 에러');
    }
  }
}
