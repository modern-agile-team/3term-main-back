import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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
      const newMailboxNo: number = !mailboxNo
        ? await this.mailboxRepository.createMailbox()
        : mailboxNo;
      if (!newMailboxNo) {
        throw new InternalServerErrorException('쪽지 보내기 에러');
      }
      const mailbox: Mailbox = await this.mailboxRepository.findOne(
        newMailboxNo,
        {
          select: ['no'],
          relations: ['letters', 'mailboxUsers'],
        },
      );
      const sender: User = await this.userRepository.findOne(senderNo, {
        relations: ['sendLetters', 'mailboxUsers'],
      });
      this.errorConfirm.notFoundError(
        sender,
        '채팅 전송자를 찾을 수 없습니다.',
      );

      const receiver: User = await this.userRepository.findOne(receiverNo, {
        relations: ['receivedLetters', 'mailboxUsers'],
      });
      this.errorConfirm.notFoundError(receiver, '상대방을 찾을 수 없습니다.');

      const newLetterNo: Letter = await this.letterRepository.sendLetter(
        sender,
        receiver,
        mailbox,
        description,
      );
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

        await this.userRepository
          .createQueryBuilder()
          .relation(User, 'mailboxUsers')
          .of(sender)
          .add(senderMailboxUserNo);
        await this.userRepository
          .createQueryBuilder()
          .relation(User, 'mailboxUsers')
          .of(receiver)
          .add(receiverMailboxUserNo);
        await this.mailboxRepository.mailboxRelation(
          newMailboxNo,
          senderMailboxUserNo,
          'mailboxUsers',
        );
        await this.mailboxRepository.mailboxRelation(
          newMailboxNo,
          receiverMailboxUserNo,
          'mailboxUsers',
        );
      }
      await this.userRepository
        .createQueryBuilder()
        .relation(User, 'sendLetters')
        .of(sender)
        .add(newLetterNo);
      await this.userRepository
        .createQueryBuilder()
        .relation(User, 'receivedLetters')
        .of(receiver)
        .add(newLetterNo);
      await this.mailboxRepository
        .createQueryBuilder()
        .relation(Mailbox, 'letters')
        .of(mailboxNo)
        .add(newLetterNo);

      return { success: true };
      // userRepository에 userRelation이 생성되면 사용할 코드들
      // await this.userRepository.userRelation(sender, newLetter, 'sendLetters');
      // await this.userRepository.userRelation(
      //   receiver,
      //   newLetter,
      //   'receivedLetters',
      // );
      // await this.userRepository.userRelation(
      //   sender,
      //   senderMailboxUserNo,
      //   'mailboxUsers',
      // );
      // await this.userRepository.userRelation(
      //   receiver,
      //   receiverMailboxUserNo,
      //   'mailboxUsers',
      // );
    } catch (e) {
      throw e;
    }
  }
}
