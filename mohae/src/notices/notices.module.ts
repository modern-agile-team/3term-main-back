import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/repository/user.repository';
import { NoticesController } from './notices.controller';
import { NoticesService } from './notices.service';
import { NoticeRepository } from './repository/notice.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([NoticeRepository, UserRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [NoticesController],
  providers: [NoticesService],
})
export class NoticesModule {}
