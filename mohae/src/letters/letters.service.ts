import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/repository/user.repository';
import { SendLetterDto } from './dto/letter.dto';
import { LetterRepository } from './repository/letter.repository';

@Injectable()
export class LettersService {
  constructor(
    @InjectRepository(LetterRepository)
    private letterRepository: LetterRepository,

    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async findAllLetters() {
    return await this.letterRepository.findAllLetters();
  }

  async sendLetter(sendLetterDto: SendLetterDto) {
    const { senderNo, receiverNo, description } = sendLetterDto;
    const sender = await this.userRepository.findOne(senderNo, {
      relations: ['sendLetters'],
    });

    const receiver = await this.userRepository.findOne(receiverNo, {
      relations: ['receivedLetters'],
    });

    const { insertId, affectedRows } = await this.letterRepository.sendLetter(
      sender,
      receiver,
      description,
    );
    if (!affectedRows) {
      throw new InternalServerErrorException();
    }
    const newLetter = await this.letterRepository.findOne(insertId);

    sender.sendLetters.push(newLetter);
    receiver.receivedLetters.push(newLetter);

    return newLetter;
  }
}
