import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailboxesModule } from 'src/mailboxes/mailboxes.module';
import { MailboxUserRepository } from './repository/mailbox.repository';
import { MailboxUserService } from './mailbox-user.service';

@Module({
  imports: [
    forwardRef(() => MailboxesModule),
    TypeOrmModule.forFeature([MailboxUserRepository]),
  ],
  providers: [MailboxUserService],
  exports: [MailboxUserService],
})
export class MailboxUserModule {}
