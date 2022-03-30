import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/repository/user.repository';
import { ErrorConfirm } from 'src/utils/error';
import { SendLetterDto } from './dto/letter.dto';
import { LetterRepository } from './repository/letter.repository';

@Injectable()
export class LettersService {
  constructor(
    @InjectRepository(LetterRepository)
    private letterRepository: LetterRepository,

    @InjectRepository(UserRepository)
    private userRepository: UserRepository,

    private errorConfirm: ErrorConfirm,
  ) {}

  async findAllLetters() {
    const letters = await this.letterRepository.findAllLetters();

    return letters;
  }

  async sendLetter(sendLetterDto: SendLetterDto) {
    const { senderNo, receiverNo, description } = sendLetterDto;

    try {
      const sender = await this.userRepository.findOne(senderNo, {
        relations: ['sendLetters'],
      });
      this.errorConfirm.notFoundError(
        sender,
        '쪽지를 작성한 유저를 찾을 수 없습니다.',
      );

      const receiver = await this.userRepository.findOne(receiverNo, {
        relations: ['receivedLetters'],
      });
      this.errorConfirm.notFoundError(
        receiver,
        '쪽지를 전달받을 유저를 찾을 수 없습니다.',
      );

      if (sender.no === receiver.no) {
        throw new UnauthorizedException(
          '본인에게는 쪽지를 전송할 수 없습니다.',
        );
      }

      const { insertId } = await this.letterRepository.sendLetter(
        sender,
        receiver,
        description,
      );

      const newLetter = await this.letterRepository.findOne(insertId);

      sender.sendLetters.push(newLetter);
      receiver.receivedLetters.push(newLetter);

      return { success: true };
    } catch (e) {
      throw e;
    }
  }
}
