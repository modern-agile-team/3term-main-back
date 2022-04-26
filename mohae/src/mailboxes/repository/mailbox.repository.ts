import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Mailbox } from '../entity/mailbox.entity';

@EntityRepository(Mailbox)
export class MailboxRepository extends Repository<Mailbox> {
  async findAllMailboxes(loginUserNo: number) {
    try {
      const mailbox = await this.createQueryBuilder('mailboxes')
        .leftJoin('mailboxes.users', 'users')
        .leftJoin('mailboxes.letters', 'letters')
        .leftJoin('letters.sender', 'sender')
        .leftJoin('letters.receiver', 'receiver')
        .select([
          'mailboxes.no',
          'users.no',
          'users.name',
          'letters.no',
          'letters.description',
          'letters.reading_flag',
          'sender.no',
          'receiver.no',
        ])
        .where('users.no = :loginUserNo', { loginUserNo })
        // .andWhere('users.no = sender.no')
        // .orWhere('users.no = receiver.no')
        .orderBy('letters.createdAt', 'DESC')
        .getMany();

      return mailbox;
    } catch {
      throw new InternalServerErrorException(
        '### 유저 쪽지함 목록 조회 : 알 수 없는 서버 에러입니다.',
      );
    }
  }

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
