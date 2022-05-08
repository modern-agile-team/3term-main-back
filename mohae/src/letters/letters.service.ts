import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entity/user.entity';
import { UserRepository } from 'src/auth/repository/user.repository';
import { Mailbox, MailboxUser } from 'src/mailboxes/entity/mailbox.entity';
import {
  MailboxRepository,
  MailboxUserRepository,
} from 'src/mailboxes/repository/mailbox.repository';
import { ErrorConfirm } from 'src/utils/error';
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

    private errorConfirm: ErrorConfirm,
  ) {}

  async sendLetter({
    senderNo,
    receiverNo,
    mailboxNo,
    description,
  }: SendLetterDto) {
    try {
      const confirmedMailboxNo: number = !mailboxNo
        ? await this.mailboxRepository.createMailbox()
        : mailboxNo;
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

      const { insertId, affectedRows } = await this.letterRepository.sendLetter(
        sender,
        receiver,
        mailbox,
        description,
      );
      if (!affectedRows) {
        throw new Error('쪽지가 정상적으로 저장되지 않았습니다.');
      }
      const newLetterNo = insertId;
      this.errorConfirm.notFoundError(newLetterNo, 'newLetterNo 생성 실패');

      if (!mailboxNo) {
        const senderMailboxUserNo: MailboxUser =
          await this.mailboxUserRepository.saveMailboxUser(mailbox, sender);
        this.errorConfirm.notFoundError(
          senderMailboxUserNo,
          'senderMailboxUser 생성 실패',
        );

        const receiverMailboxUserNo: MailboxUser =
          await this.mailboxUserRepository.saveMailboxUser(mailbox, receiver);
        this.errorConfirm.notFoundError(
          receiverMailboxUserNo,
          'receiverMailboxUserNo 생성 실패',
        );

        await this.userRepository.userRelation(
          sender,
          senderMailboxUserNo,
          'mailboxUsers',
        );
        await this.userRepository.userRelation(
          receiver,
          receiverMailboxUserNo,
          'mailboxUsers',
        );
        await this.mailboxRepository.mailboxRelation(
          confirmedMailboxNo,
          senderMailboxUserNo,
          'mailboxUsers',
        );
        await this.mailboxRepository.mailboxRelation(
          confirmedMailboxNo,
          receiverMailboxUserNo,
          'mailboxUsers',
        );
      }
      // userRepository에 userRelation이 생성되면 사용할 코드들
      await this.userRepository.userRelation(
        sender,
        newLetterNo,
        'sendLetters',
      );
      await this.userRepository.userRelation(
        receiver,
        newLetterNo,
        'receivedLetters',
      );
      await this.mailboxRepository.mailboxRelation(
        confirmedMailboxNo,
        newLetterNo,
        'letters',
      );

      return {
        success: true,
      };
    } catch (e) {
      throw e;
    }
  }
}
