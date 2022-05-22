import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/repository/user.repository';
import { LetterRepository } from 'src/letters/repository/letter.repository';
import { ErrorConfirm } from 'src/common/utils/error';
import { MailboxesController } from './mailboxes.controller';
import { MailboxesService } from './mailboxes.service';
import { MailboxRepository } from './repository/mailbox.repository';
import { MailboxUserModule } from 'src/mailbox-user/mailbox-user.module';
import { Mailbox } from './entity/mailbox.entity';
import { LettersModule } from 'src/letters/letters.module';

@Module({
  imports: [
    forwardRef(() => MailboxUserModule),
    forwardRef(() => LettersModule),
    TypeOrmModule.forFeature([Mailbox, UserRepository]),
  ],
  controllers: [MailboxesController],
  providers: [MailboxesService, MailboxRepository, ErrorConfirm],
  exports: [MailboxesService, MailboxRepository],
})
export class MailboxesModule {}
