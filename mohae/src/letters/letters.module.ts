import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/repository/user.repository';
import { ErrorConfirm } from 'src/common/utils/error';
import { LettersController } from './letters.controller';
import { LettersService } from './letters.service';
import { LetterRepository } from './repository/letter.repository';
import { MailboxUserModule } from 'src/mailbox-user/mailbox-user.module';
import { Letter } from './entity/letter.entity';
import { MailboxesModule } from 'src/mailboxes/mailboxes.module';

@Module({
  imports: [
    MailboxUserModule,
    forwardRef(() => MailboxesModule),
    TypeOrmModule.forFeature([Letter, UserRepository]),
  ],
  controllers: [LettersController],
  providers: [LettersService, LetterRepository, ErrorConfirm],
  exports: [LettersService, LetterRepository],
})
export class LettersModule {}
