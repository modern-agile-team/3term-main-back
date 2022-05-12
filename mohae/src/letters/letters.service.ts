import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entity/user.entity';
import { UserRepository } from 'src/auth/repository/user.repository';
import { Mailbox, MailboxUser } from 'src/mailboxes/entity/mailbox.entity';
import {
  MailboxRepository,
  MailboxUserRepository,
} from 'src/mailboxes/repository/mailbox.repository';
import { ErrorConfirm } from 'src/utils/error';
import { Connection } from 'typeorm';
import { SendLetterDto } from './dto/letter.dto';
import { Letter } from './entity/letter.entity';
import { LetterRepository } from './repository/letter.repository';

@Injectable()
export class LettersService {
  constructor(
    @InjectRepository(LetterRepository)
    private letterRepository: LetterRepository,

    @InjectRepository(UserRepository)
    private userRepository: UserRepository,

    @InjectRepository(MailboxRepository)
    private mailboxRepository: MailboxRepository,

    @InjectRepository(MailboxUserRepository)
    private mailboxUserRepository: MailboxUserRepository,

    private connection: Connection,

    private errorConfirm: ErrorConfirm,
  ) {}

  async sendLetter({
    senderNo,
    receiverNo,
    mailboxNo,
    description,
  }: SendLetterDto) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const confirmedMailboxNo: number =
        mailboxNo ||
        (await queryRunner.manager
          .getCustomRepository(MailboxRepository)
          .createMailbox());

      if (!confirmedMailboxNo) {
        throw new Error('쪽지 생성중 쪽지함 번호 유무 판단 조건문 에러');
      }

      const sender: User = await this.userRepository.findOne(senderNo, {
        select: ['no'],
      });

      this.errorConfirm.notFoundError(
        sender,
        '채팅 전송자를 찾을 수 없습니다.',
      );

      const receiver: User = await this.userRepository.findOne(receiverNo, {
        select: ['no'],
      });

      this.errorConfirm.notFoundError(receiver, '상대방을 찾을 수 없습니다.');

      const mailbox: Mailbox = await this.mailboxRepository.searchMailbox(
        confirmedMailboxNo,
        0,
      );
      const { insertId, affectedRows } = await queryRunner.manager
        .getCustomRepository(LetterRepository)
        .sendLetter(sender, receiver, mailbox, description);

      if (!affectedRows) {
        throw new Error('쪽지가 정상적으로 저장되지 않았습니다.');
      }

      const newLetterNo = insertId;

      this.errorConfirm.notFoundError(newLetterNo, 'newLetterNo 생성 실패');

      if (!mailboxNo) {
        const senderMailboxUserNo: MailboxUser = await queryRunner.manager
          .getCustomRepository(MailboxUserRepository)
          .saveMailboxUser(mailbox, sender);

        this.errorConfirm.notFoundError(
          senderMailboxUserNo,
          'senderMailboxUser 생성 실패',
        );

        const receiverMailboxUserNo: MailboxUser = await queryRunner.manager
          .getCustomRepository(MailboxUserRepository)
          .saveMailboxUser(mailbox, receiver);

        this.errorConfirm.notFoundError(
          receiverMailboxUserNo,
          'receiverMailboxUserNo 생성 실패',
        );

        await queryRunner.manager
          .getCustomRepository(UserRepository)
          .userRelation(sender, senderMailboxUserNo, 'mailboxUsers');
        await queryRunner.manager
          .getCustomRepository(UserRepository)
          .userRelation(receiver, receiverMailboxUserNo, 'mailboxUsers');
        await queryRunner.manager
          .getCustomRepository(MailboxRepository)
          .mailboxRelation(
            confirmedMailboxNo,
            senderMailboxUserNo,
            'mailboxUsers',
          );
        await queryRunner.manager
          .getCustomRepository(MailboxRepository)
          .mailboxRelation(
            confirmedMailboxNo,
            receiverMailboxUserNo,
            'mailboxUsers',
          );
      }

      await queryRunner.manager
        .getCustomRepository(UserRepository)
        .userRelation(sender, newLetterNo, 'sendLetters');
      await queryRunner.manager
        .getCustomRepository(UserRepository)
        .userRelation(sender, newLetterNo, 'sendLetters');
      await queryRunner.manager
        .getCustomRepository(MailboxRepository)
        .mailboxRelation(confirmedMailboxNo, newLetterNo, 'letters');

      await queryRunner.commitTransaction();
      return {
        success: true,
      };
    } catch (err) {
      // 에러가 발생시 롤백
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        `${err}, 쪽지 전송중 알 수 없는 에러 발생`,
      );
    } finally {
      // 직접 생성한 QueryRunner는 해제시켜 주어야 함
      await queryRunner.release();
    }
  }
}
