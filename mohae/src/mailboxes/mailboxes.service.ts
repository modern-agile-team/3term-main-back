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

  async findAllMailboxes(loginUserNo: number) {
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
        .leftJoin('user.mailboxes', 'mailbox')
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

      for (const letter of notReadLetter) {
        await this.letterRepository.updateReading(letter.no);
      }
      return mailbox;
    } catch (e) {
      throw e;
    }
  }

  async checkMailbox(oneselfNo: number, opponentNo: number) {
    try {
      const mailbox = await this.mailboxRepository.checkMailbox(
        oneselfNo,
        opponentNo,
      );

      const test = await this.mailboxUserRepository
        .createQueryBuilder('mailboxUser')
        .leftJoin('mailboxUser.user', 'users')
        .leftJoin('mailboxUser.mailbox', 'mailboxes')
        .select([
          'mailboxUser.no',
          'users.no',
          // 'users.nickname',
          'mailboxes.no',
        ])
        .where('users.no = :oneselfNo OR users.no = :opponentNo', {
          oneselfNo,
          opponentNo,
        })
        .groupBy('mailboxUser.no')
        // .having('mailboxes.no IN (:...mn)', { mn: [1] })
        .getMany();

      const t = await this.userRepository
        .createQueryBuilder('users')
        .leftJoinAndSelect('users.mailboxUsers', 'MU')
        .leftJoin('MU.user', 'MUUser')
        .leftJoin('MU.mailbox', 'MUMailbox')
        // .select([
        //   'users.no',
        //   'users.nickname',
        //   'MU.no',
        //   'MUMailbox.no',
        //   'MUUser.no',
        // ])
        .where('users.no = :oneselfNo', { oneselfNo })
        // .andWhere('MUUser.no = :opponentNo', { opponentNo })
        // .andWhere('MUMailbox.no = :no')
        .getOne();

      console.log('###1', test);
      console.log(t);
      // return mailbox;
    } catch (e) {
      throw e;
    }
  }
}
