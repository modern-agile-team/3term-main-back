import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/repository/user.repository';
import {
  MailboxRepository,
  MailboxUserRepository,
} from 'src/mailboxes/repository/mailbox.repository';
import { ErrorConfirm } from 'src/utils/error';
import { SendLetterDto } from './dto/letter.dto';
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
      const newMailboxNo = !mailboxNo
        ? await this.mailboxRepository.createMailbox()
        : mailboxNo;

      const mailboxRelation = await this.mailboxRepository.findOne(
        newMailboxNo,
        {
          select: ['no'],
          relations: ['letters'],
        },
      );

      const sender = await this.userRepository.findOne(senderNo, {
        select: ['no'],
        relations: ['sendLetters'],
      });
      this.errorConfirm.notFoundError(
        sender,
        '쪽지를 작성한 유저를 찾을 수 없습니다.',
      );

      const receiver = await this.userRepository.findOne(receiverNo, {
        select: ['no'],
        relations: ['receivedLetters'],
      });
      this.errorConfirm.notFoundError(
        receiver,
        '쪽지를 전달받을 유저를 찾을 수 없습니다.',
      );

      if (sender.no === receiver.no) {
        throw new UnauthorizedException(
          '본인에게는 쪽지를 전송할 수 없습니다.',
        );
      }

      await this.mailboxUserRepository.saveMailboxUser(mailboxRelation, sender);
      await this.mailboxUserRepository.saveMailboxUser(
        mailboxRelation,
        receiver,
      );

      const { insertId } = await this.letterRepository.sendLetter(
        sender,
        receiver,
        description,
        mailboxRelation,
      );

      const newLetter = await this.letterRepository.findOne(insertId);

      sender.sendLetters.push(newLetter);
      receiver.receivedLetters.push(newLetter);
      mailboxRelation.letters.push(newLetter);

      return { success: true };
    } catch (e) {
      throw e;
    }
  }
}
