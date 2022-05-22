import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailboxesModule } from 'src/mailboxes/mailboxes.module';
import { MailboxUser } from './entity/mailbox-user.entity';
import { MailboxUserRepository } from './repository/mailbox.repository';

@Module({
  imports: [
    forwardRef(() => MailboxesModule),
    TypeOrmModule.forFeature([MailboxUser]),
  ],
  providers: [MailboxUserRepository],
  exports: [MailboxUserRepository],
})
export class MailboxUserModule {}
