import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserRepository } from 'src/auth/repository/user.repository';
import { ErrorConfirm } from 'src/common/utils/error';
import { NoticesController } from './notices.controller';
import { NoticesService } from './notices.service';
import { NoticeRepository } from './repository/notice.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([NoticeRepository, UserRepository]),
    AuthModule,
  ],
  controllers: [NoticesController],
  providers: [NoticesService, ErrorConfirm],
})
export class NoticesModule {}
