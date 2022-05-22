import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/repository/user.repository';
import { LetterRepository } from 'src/letters/repository/letter.repository';
import { ErrorConfirm } from 'src/common/utils/error';
import { MailboxesController } from './mailboxes.controller';
import { MailboxesService } from './mailboxes.service';
import { MailboxRepository } from './repository/mailbox.repository';
import { MailboxUserRepository } from 'src/mailbox-user/repository/mailbox.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MailboxRepository,
      UserRepository,
      LetterRepository,
      MailboxUserRepository,
    ]),
  ],
  controllers: [MailboxesController],
  providers: [MailboxesService, ErrorConfirm],
})
export class MailboxesModule {}
