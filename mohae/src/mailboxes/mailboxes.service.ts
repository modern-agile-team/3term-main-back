import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/repository/user.repository';
import { Letter } from 'src/letters/entity/letter.entity';
import { LetterRepository } from 'src/letters/repository/letter.repository';
import { ErrorConfirm } from 'src/utils/error';
import {
  MailboxRepository,
  MailboxUserRepository,
} from './repository/mailbox.repository';

@Injectable()
export class MailboxesService {
  constructor(
    @InjectRepository(MailboxRepository)
    private mailboxRepository: MailboxRepository,

    @InjectRepository(UserRepository)
    private userRepository: UserRepository,

    @InjectRepository(LetterRepository)
    private letterRepository: LetterRepository,

    @InjectRepository(MailboxUserRepository)
    private mailboxUserRepository: MailboxUserRepository,

    private errorConfirm: ErrorConfirm,
  ) {}

  async readAllMailboxes(loginUserNo: number) {
    try {
      const Letters = this.letterRepository
        .createQueryBuilder()
        .subQuery()
        .select([
          'letter.no AS no',
          'letter.mailbox AS mailbox',
          'letter.description AS description',
          'letter.createdAt AS createdAt',
        ])
        .from(Letter, 'letter')
        .groupBy('letter.no')
        .limit(1)
        .orderBy('letter.createdAt', 'DESC')
        .getQuery();

      const mailbox = await this.userRepository
        .createQueryBuilder('user')
        .where('user.no = :loginUserNo', { loginUserNo })
        .leftJoin('user.mailboxUsers', 'mailboxUsers')
        .leftJoin('mailboxUsers.mailbox', 'mailbox')
        .leftJoin(Letters, 'letter', 'letter.mailbox = mailbox.no')
        .select([
          'user.no AS userNo',
          'user.photo_url AS photoUrl',
          'user.nickname AS nickname',
          'mailbox.no AS mailboxNo',
          'letter.no AS letterNo',
          'letter.description AS letterDescription',
          'letter.createdAt AS letterCreatedAt',
        ])
        .orderBy('letter.createdAt', 'DESC')
        .getRawMany();

      return mailbox;
    } catch (e) {
      throw e;
    }
  }

  async searchMailbox(mailboxNo: number, limit: number) {
    try {
      const mailbox = await this.mailboxRepository.searchMailbox(
        mailboxNo,
        limit,
      );

      const notReadLetter = await this.letterRepository.notReadingLetter(
        mailboxNo,
      );
      this.errorConfirm.notFoundError(
        notReadLetter,
        '경로를 찾을 수 없습니다.',
      );

      notReadLetter.forEach(async (letter) => {
        await this.letterRepository.updateReading(letter.no);
      });

      return mailbox;
    } catch (e) {
      throw e;
    }
  }

  async checkMailbox(oneselfNo: number, opponentNo: number) {
    try {
      this.errorConfirm.unauthorizedError(
        oneselfNo !== opponentNo,
        '자기 자신에게 쪽지를 보낼 수 없습니다.',
      );
      const mailbox = await this.mailboxUserRepository.serachMailboxUser(
        oneselfNo,
        opponentNo,
      );

      return !mailbox
        ? {
            success: false,
          }
        : {
            success: true,
            mailboxNo: mailbox.mailboxNo,
          };
    } catch (e) {
      throw e;
    }
  }
}
