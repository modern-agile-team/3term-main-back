import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/repository/user.repository';
import { Letter } from 'src/letters/entity/letter.entity';
import { LetterRepository } from 'src/letters/repository/letter.repository';
import { ErrorConfirm } from 'src/common/utils/error';
import { Mailbox } from './entity/mailbox.entity';
import { MailboxRepository } from './repository/mailbox.repository';
import { MailboxUserRepository } from 'src/mailbox-user/repository/mailbox.repository';
import { User } from 'src/auth/entity/user.entity';

@Injectable()
export class MailboxesService {
  constructor(
    @InjectRepository(MailboxRepository)
    private mailboxRepository: MailboxRepository,

    private userRepository: UserRepository,
    private letterRepository: LetterRepository,
    private mailboxUserRepository: MailboxUserRepository,
    private errorConfirm: ErrorConfirm,
  ) {}

  async readAllMailboxes(user: User): Promise<any> {
    try {
      const Letters: string = this.letterRepository
        .createQueryBuilder('letter')
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

      const mailbox: any = await this.userRepository
        .createQueryBuilder('user')
        .where('user.no = :loginUserNo', { loginUserNo: user.no })
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
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async searchMailbox(mailboxNo: number, limit: number): Promise<Mailbox> {
    try {
      const mailbox: Mailbox = await this.mailboxRepository.searchMailbox(
        mailboxNo,
        limit,
      );

      this.errorConfirm.notFoundError(
        mailbox,
        '해당 쪽지함을 찾지 못했습니다.',
      );

      await this.letterRepository.updateReading(mailboxNo);

      return mailbox;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async checkMailbox(oneself: User, opponentNo: number): Promise<any> {
    try {
      this.errorConfirm.unauthorizedError(
        oneself.no !== opponentNo,
        '자기 자신에게 쪽지를 보낼 수 없습니다.',
      );

      const mailbox: any = await this.mailboxUserRepository.searchMailboxUser(
        oneself.no,
        opponentNo,
      );

      return {
        success: !!mailbox,
        mailboxNo: mailbox?.mailboxNo,
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
