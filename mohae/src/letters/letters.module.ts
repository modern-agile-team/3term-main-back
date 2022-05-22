import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/repository/user.repository';
import { MailboxesService } from 'src/mailboxes/mailboxes.service';
import { MailboxRepository } from 'src/mailboxes/repository/mailbox.repository';
import { ErrorConfirm } from 'src/common/utils/error';
import { LettersController } from './letters.controller';
import { LettersService } from './letters.service';
import { LetterRepository } from './repository/letter.repository';
import { MailboxUserRepository } from 'src/mailbox-user/repository/mailbox.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LetterRepository,
      UserRepository,
      MailboxRepository,
      MailboxUserRepository,
    ]),
  ],
  controllers: [LettersController],
  providers: [LettersService, MailboxesService, ErrorConfirm],
})
export class LettersModule {}
