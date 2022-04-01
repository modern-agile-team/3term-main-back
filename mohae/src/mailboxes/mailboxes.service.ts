import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/repository/user.repository';
import { LetterRepository } from 'src/letters/repository/letter.repository';
import { ErrorConfirm } from 'src/utils/error';
import { MailboxRepository } from './repository/mailbox.repository';

@Injectable()
export class MailboxesService {
  constructor(
    @InjectRepository(MailboxRepository)
    private mailboxRepository: MailboxRepository,

    @InjectRepository(UserRepository)
    private userRepository: UserRepository,

    @InjectRepository(LetterRepository)
    private letterRepository: LetterRepository,

    private errorConfirm: ErrorConfirm,
  ) {}

  async findAllMailboxes(no: number) {
    try {
      const mailbox = await this.mailboxRepository.findAllMailboxes(no);

      return mailbox;
    } catch (e) {
      throw e;
    }
  }

  async searchMailbox(myNo, yourNo) {
    try {
      if (myNo === yourNo) {
        throw new UnauthorizedException('자신에게는 채팅을 보낼 수 없습니다.');
      }
      const me = await this.userRepository.findOne(myNo);
      this.errorConfirm.notFoundError(me, '내 정보 못찾음');

      const you = await this.userRepository.findOne(yourNo);
      this.errorConfirm.notFoundError(you, '너 정보 못찾음');

      const mailboxNo = await this.mailboxRepository.searchMailbox(
        myNo,
        yourNo,
      );

      if (!mailboxNo) {
        const user1 = await this.userRepository.findOne(myNo);
        const user2 = await this.userRepository.findOne(yourNo);
        const newMailboxNo = await this.mailboxRepository.createMailbox();
        const relation = await this.mailboxRepository.findOne(newMailboxNo, {
          relations: ['users'],
        });

        relation.users.push(user1);
        relation.users.push(user2);

        await this.mailboxRepository.save(relation);

        return this.mailboxRepository.findOneMailbox(newMailboxNo);
      }

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

      const letterContent = await this.letterRepository.getLetterContent(
        myNo,
        yourNo,
      );

      return letterContent;
    } catch (e) {
      throw e;
    }
  }
}
