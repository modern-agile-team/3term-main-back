import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/repository/user.repository';
import { MailboxesService } from 'src/mailboxes/mailboxes.service';
import {
  MailboxRepository,
  MailboxUserRepository,
} from 'src/mailboxes/repository/mailbox.repository';
import { ErrorConfirm } from 'src/common/utils/error';
import { LettersController } from './letters.controller';
import { LettersService } from './letters.service';
import { LetterRepository } from './repository/letter.repository';

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
