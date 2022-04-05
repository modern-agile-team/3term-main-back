import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticesController } from './notices.controller';
import { NoticesService } from './notices.service';
import { NoticeRepository } from './repository/notice.repository';

@Module({
  imports: [TypeOrmModule.forFeature([NoticeRepository])],
  controllers: [NoticesController],
  providers: [NoticesService],
})
export class NoticesModule {}
