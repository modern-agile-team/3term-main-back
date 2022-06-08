import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entity/user.entity';
import { UserRepository } from 'src/auth/repository/user.repository';
import { Mailbox } from 'src/mailboxes/entity/mailbox.entity';
import { MailboxRepository } from 'src/mailboxes/repository/mailbox.repository';
import { ErrorConfirm } from 'src/common/utils/error';
import { Connection } from 'typeorm';
import { SendLetterDto } from './dto/letter.dto';
import { LetterRepository } from './repository/letter.repository';
import { MailboxUser } from 'src/mailbox-user/entity/mailbox-user.entity';
import { MailboxUserRepository } from 'src/mailbox-user/repository/mailbox.repository';

@Injectable()
export class LettersService {
  constructor(
    @InjectRepository(LetterRepository)
    private letterRepository: LetterRepository,

    private userRepository: UserRepository,
    private mailboxRepository: MailboxRepository,
    private mailboxUserRepository: MailboxUserRepository,

    private connection: Connection,
    private errorConfirm: ErrorConfirm,
  ) {}

  async sendLetter(
    sender: User,
    { receiverNo, mailboxNo, description }: SendLetterDto,
    imageUrl?: string,
  ): Promise<void> {
    this.errorConfirm.badRequestError(
      description || imageUrl,
      '쪽지 내용이나 이미지 파일을 전송해 주세요.',
    );
    this.errorConfirm.badRequestError(
      !(description && imageUrl),
      '쪽지 내용과 이미지 중 하나만 전송해 주세요.',
    );

    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const confirmedMailboxNo: number =
        +mailboxNo ||
        (await queryRunner.manager
          .getCustomRepository(MailboxRepository)
          .createMailbox());

      this.errorConfirm.badGatewayError(
        confirmedMailboxNo,
        '쪽지함 번호 유무 판단 에러',
      );

      const receiver: User = await this.userRepository.findOne(+receiverNo, {
        select: ['no'],
      });

      this.errorConfirm.notFoundError(receiver, '상대방을 찾을 수 없습니다.');

      const mailbox: Mailbox = await this.mailboxRepository.searchMailbox(
        confirmedMailboxNo,
        0,
      );
      const { insertId, affectedRows } = await queryRunner.manager
        .getCustomRepository(LetterRepository)
        .sendLetter(sender, receiver, mailbox, description, imageUrl);

      this.errorConfirm.badGatewayError(
        affectedRows,
        '쪽지가 정상적으로 저장되지 않았습니다.',
      );

      if (!mailboxNo) {
        const senderMailboxUserNo: MailboxUser = await queryRunner.manager
          .getCustomRepository(MailboxUserRepository)
          .saveMailboxUser(mailbox, sender);

        this.errorConfirm.badGatewayError(
          senderMailboxUserNo,
          'senderMailboxUser 생성 실패',
        );

        const receiverMailboxUserNo: MailboxUser = await queryRunner.manager
          .getCustomRepository(MailboxUserRepository)
          .saveMailboxUser(mailbox, receiver);

        this.errorConfirm.badGatewayError(
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
          .mailboxAddRelation(
            confirmedMailboxNo,
            senderMailboxUserNo,
            'mailboxUsers',
          );
        await queryRunner.manager
          .getCustomRepository(MailboxRepository)
          .mailboxAddRelation(
            confirmedMailboxNo,
            receiverMailboxUserNo,
            'mailboxUsers',
          );
      }
      const newLetterNo = insertId;

      await queryRunner.manager
        .getCustomRepository(UserRepository)
        .userRelation(sender, newLetterNo, 'sendLetters');
      await queryRunner.manager
        .getCustomRepository(UserRepository)
        .userRelation(receiver, newLetterNo, 'receivedLetters');
      await queryRunner.manager
        .getCustomRepository(MailboxRepository)
        .mailboxAddRelation(confirmedMailboxNo, newLetterNo, 'letters');

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
