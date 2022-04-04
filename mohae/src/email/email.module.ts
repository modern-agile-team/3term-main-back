import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserRepository } from 'src/auth/repository/user.repository';
import { ErrorConfirm } from 'src/utils/error';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository]), AuthModule],
  controllers: [EmailController],
  providers: [EmailService, ErrorConfirm],
})
export class EmailModule {}
