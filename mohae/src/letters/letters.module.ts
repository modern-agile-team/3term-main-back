import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/repository/user.repository';
import { LettersController } from './letters.controller';
import { LettersService } from './letters.service';
import { LetterRepository } from './repository/letter.repository';

@Module({
  imports: [TypeOrmModule.forFeature([LetterRepository, UserRepository])],
  controllers: [LettersController],
  providers: [LettersService],
})
export class LettersModule {}
