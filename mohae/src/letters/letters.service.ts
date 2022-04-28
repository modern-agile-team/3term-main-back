import {
  Injectable,
  InternalServerErrorException,
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
      const sender = await this.userRepository.findOne(senderNo, {
        relations: ['sendLetters', 'mailboxUsers'],
      });

      const receiver = await this.userRepository.findOne(receiverNo, {
        relations: ['receivedLetters', 'mailboxUsers'],
      });

      console.log(sender);
      console.log(receiver);

      const mailbox = await this.mailboxRepository.findOne(mailboxNo, {
        relations: ['letters', 'mailboxUsers'],
      });
      console.log(mailbox);

      const { insertId } = await this.letterRepository.sendLetter(
        sender,
        receiver,
        mailbox,
        description,
      );

      const senderMailboxUserNo =
        await this.mailboxUserRepository.saveMailboxUser(mailbox, sender);
      const receiverMailboxUserNo =
        await this.mailboxUserRepository.saveMailboxUser(mailbox, receiver);

      sender.sendLetters.push(insertId);
      sender.mailboxUsers.push(senderMailboxUserNo);
      receiver.receivedLetters.push(insertId);
      receiver.mailboxUsers.push(receiverMailboxUserNo);

      mailbox.letters.push(insertId);
      mailbox.mailboxUsers.push(senderMailboxUserNo, receiverMailboxUserNo);
      // const newMailboxNo = !mailboxNo
      //   ? await this.mailboxRepository.createMailbox()
      //   : mailboxNo;
      // if (!newMailboxNo) {
      //   throw new InternalServerErrorException('쪽지 보내기 에러');
      // }
      // const mailboxRelation = await this.mailboxRepository.findOne(
      //   newMailboxNo,
      //   {
      //     select: ['no'],
      //     relations: ['letters', 'mailboxUsers'],
      //   },
      // );
      // // console.log(mailboxRelation, newMailboxNo);
      // const sender = await this.userRepository.findOne(senderNo, {
      //   select: ['no'],
      //   relations: ['sendLetters', 'mailboxUsers'],
      // });
      // this.errorConfirm.notFoundError(
      //   sender,
      //   '쪽지를 작성한 유저를 찾을 수 없습니다.',
      // );

      // const receiver = await this.userRepository.findOne(receiverNo, {
      //   select: ['no'],
      //   relations: ['receivedLetters', 'mailboxUsers'],
      // });
      // this.errorConfirm.notFoundError(
      //   receiver,
      //   '쪽지를 전달받을 유저를 찾을 수 없습니다.',
      // );
      // if (sender.no === receiver.no) {
      //   throw new UnauthorizedException(
      //     '본인에게는 쪽지를 전송할 수 없습니다.',
      //   );
      // }

      // const senderMailboxUserNo =
      //   await this.mailboxUserRepository.saveMailboxUser(
      //     mailboxRelation,
      //     sender,
      //   );
      // const receiverMailboxUserNo =
      //   await this.mailboxUserRepository.saveMailboxUser(
      //     mailboxRelation,
      //     receiver,
      //   );

      // const { insertId } = await this.letterRepository.sendLetter(
      //   sender,
      //   receiver,
      //   description,
      //   mailboxRelation,
      // );

      // sender.sendLetters.push(insertId);
      // sender.mailboxUsers.push(senderMailboxUserNo);

      // receiver.receivedLetters.push(insertId);
      // receiver.mailboxUsers.push(receiverMailboxUserNo);

      // mailboxRelation.letters.push(insertId);
      // mailboxRelation.mailboxUsers.push(senderMailboxUserNo);
      // mailboxRelation.mailboxUsers.push(receiverMailboxUserNo);

      // await sender.save();
      // await receiver.save();
      // await mailboxRelation.save();
      return { success: true };
    } catch (e) {
      throw e;
    }
  }
}
