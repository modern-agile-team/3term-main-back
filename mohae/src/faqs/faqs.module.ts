import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/repository/user.repository';
import { ErrorConfirm } from 'src/utils/error';
import { FaqsController } from './faqs.controller';
import { FaqsService } from './faqs.service';
import { FaqRepository } from './repository/faq.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([FaqRepository, UserRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [FaqsController],
  providers: [FaqsService, ErrorConfirm],
})
export class FaqsModule {}
