import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailboxesController } from './mailboxes.controller';
import { MailboxesService } from './mailboxes.service';
import { MailBoxRepository } from './repository/mailbox.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MailBoxRepository])],
  controllers: [MailboxesController],
  providers: [MailboxesService],
})
export class MailboxesModule {}
