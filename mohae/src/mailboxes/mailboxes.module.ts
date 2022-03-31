import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailboxesController } from './mailboxes.controller';
import { MailboxesService } from './mailboxes.service';
import { MailboxRepository } from './repository/mailbox.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MailboxRepository])],
  controllers: [MailboxesController],
  providers: [MailboxesService],
})
export class MailboxesModule {}
