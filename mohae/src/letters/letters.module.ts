import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LettersController } from './letters.controller';
import { LettersService } from './letters.service';
import { LetterRepository } from './repository/letter.repository';

@Module({
  imports: [TypeOrmModule.forFeature([LetterRepository])],
  controllers: [LettersController],
  providers: [LettersService],
})
export class LettersModule {}
