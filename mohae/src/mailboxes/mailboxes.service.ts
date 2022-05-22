import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/repository/user.repository';
import { Letter } from 'src/letters/entity/letter.entity';
import { LetterRepository } from 'src/letters/repository/letter.repository';
import { ErrorConfirm } from 'src/common/utils/error';
import { Mailbox } from './entity/mailbox.entity';
import { MailboxRepository } from './repository/mailbox.repository';
import { MailboxUserRepository } from 'src/mailbox-user/repository/mailbox.repository';

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

  async readAllMailboxes(loginUserNo: number): Promise<Mailbox[]> {
    try {
      const Letters: string = this.letterRepository
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

      const mailbox: Mailbox[] = await this.userRepository
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

  async searchMailbox(mailboxNo: number, limit: number): Promise<Mailbox> {
    try {
      const mailbox: Mailbox = await this.mailboxRepository.searchMailbox(
        mailboxNo,
        limit,
      );

      await this.letterRepository.updateReading(mailboxNo);

      return mailbox;
    } catch (e) {
      throw e;
    }
  }

  async checkMailbox(oneselfNo: number, opponentNo: number): Promise<any> {
    try {
      this.errorConfirm.unauthorizedError(
        oneselfNo !== opponentNo,
        '자기 자신에게 쪽지를 보낼 수 없습니다.',
      );
      const mailbox: any = await this.mailboxUserRepository.searchMailboxUser(
        oneselfNo,
        opponentNo,
      );

      return {
        success: !!mailbox,
        mailboxNo: mailbox?.mailboxNo,
      };
    } catch (e) {
      throw e;
    }
  }
}
