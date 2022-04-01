import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/repository/user.repository';
import { MailboxRepository } from './repository/mailbox.repository';

@Injectable()
export class MailboxesService {
  constructor(
    @InjectRepository(MailboxRepository)
    private mailboxRepository: MailboxRepository,

    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async findAllMailboxes(no: number) {
    const mailbox = await this.mailboxRepository.findAllMailboxes(no);

    return mailbox;
  }

  async searchMailbox(myNo, yourNo) {
    if (myNo === yourNo) {
      throw new UnauthorizedException('자신에게는 채팅을 보낼 수 없습니다.');
    }
    const me = await this.userRepository.findOne(myNo);
    if (!me) {
      throw new NotFoundException('내 정보 못찾음');
    }
    const you = await this.userRepository.findOne(yourNo);
    if (!you) {
      throw new NotFoundException('너 정보 못찾음');
    }
    const mailboxNo = await this.mailboxRepository.searchMailbox(myNo, yourNo);

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
    }

    const mailbox = await this.mailboxRepository.findOneMailbox(mailboxNo);
    return mailbox;
  }
}
