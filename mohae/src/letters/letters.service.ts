import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SendLetterDto } from './dto/letter.dto';
import { LetterRepository } from './repository/letter.repository';

@Injectable()
export class LettersService {
  constructor(
    @InjectRepository(LetterRepository)
    private letterRepository: LetterRepository,
  ) {}

  async findAllLetters() {
    return await this.letterRepository.findAllLetters();
  }

  async sendLetter(sendLetterDto: SendLetterDto) {
    const result = await this.letterRepository.sendLetter(sendLetterDto);

    return result;
  }
}
