import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Mailbox } from '../entity/mailbox.entity';

@EntityRepository(Mailbox)
export class MailboxRepository extends Repository<Mailbox> {
  async findAllMailboxes(loginUserNo: number) {
    try {
      const mailbox = await this.createQueryBuilder('mailboxes')
        .leftJoinAndSelect('mailboxes.users', 'users')
        .leftJoinAndSelect('mailboxes.letters', 'letters')
        .leftJoinAndSelect('letters.sender', 'sender')
        .leftJoinAndSelect('letters.receiver', 'receiver')
        .where('users.no = :loginUserNo', { loginUserNo })
        .getMany();

      return mailbox;
    } catch {
      throw new InternalServerErrorException(
        '### 유저 쪽지함 목록 조회 : 알 수 없는 서버 에러입니다.',
      );
    }
  }

  async searchMailbox(loignUserNo: number, clickedUserNo: number) {
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

        if (users[0].no === loignUserNo || users[1].no === loignUserNo) {
          if (users[0].no === clickedUserNo || users[1].no === clickedUserNo) {
            return user.no;
          }
        }
      }

      return 0;
    } catch {
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
        .values({ users: [] })
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
}
