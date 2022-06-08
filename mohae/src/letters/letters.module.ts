import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/repository/user.repository';
import { ErrorConfirm } from 'src/common/utils/error';
import { LettersController } from './letters.controller';
import { LettersService } from './letters.service';
import { LetterRepository } from './repository/letter.repository';
import { MailboxUserModule } from 'src/mailbox-user/mailbox-user.module';
import { MailboxesModule } from 'src/mailboxes/mailboxes.module';
import { MailboxRepository } from 'src/mailboxes/repository/mailbox.repository';
import { MailboxUserRepository } from 'src/mailbox-user/repository/mailbox.repository';
import { AwsService } from 'src/aws/aws.service';

@Module({
  imports: [
    MailboxUserModule,
    forwardRef(() => MailboxesModule),
    TypeOrmModule.forFeature([
      LetterRepository,
      MailboxRepository,
      MailboxUserRepository,
      UserRepository,
    ]),
  ],
  controllers: [LettersController],
  providers: [LettersService, ErrorConfirm, AwsService],
  exports: [LettersService],
})
export class LettersModule {}
