import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/repository/user.repository';
import { LetterRepository } from 'src/letters/repository/letter.repository';
import { ErrorConfirm } from 'src/common/utils/error';
import { MailboxesController } from './mailboxes.controller';
import { MailboxesService } from './mailboxes.service';
import { MailboxRepository } from './repository/mailbox.repository';
import { MailboxUserModule } from 'src/mailbox-user/mailbox-user.module';
import { LettersModule } from 'src/letters/letters.module';
import { MailboxUserRepository } from 'src/mailbox-user/repository/mailbox.repository';

@Module({
  imports: [
    forwardRef(() => MailboxUserModule),
    forwardRef(() => LettersModule),
    TypeOrmModule.forFeature([
      MailboxRepository,
      LetterRepository,
      UserRepository,
      MailboxUserRepository,
    ]),
  ],
  controllers: [MailboxesController],
  providers: [MailboxesService, ErrorConfirm],
  exports: [MailboxesService],
})
export class MailboxesModule {}
