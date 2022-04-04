import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/repository/user.repository';
import { FaqsController } from './faqs.controller';
import { FaqsService } from './faqs.service';
import { FaqRepository } from './repository/faq.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FaqRepository, UserRepository])],
  controllers: [FaqsController],
  providers: [FaqsService],
})
export class FaqsModule {}
