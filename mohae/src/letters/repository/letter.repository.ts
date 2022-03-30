import { InternalServerErrorException } from '@nestjs/common';
import { User } from 'src/auth/entity/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { SendLetterDto } from '../dto/letter.dto';
import { Letter } from '../entity/letter.entity';

@EntityRepository(Letter)
export class LetterRepository extends Repository<Letter> {
  async findAllLetters() {
    try {
      const letters = await this.createQueryBuilder('letters')
        .leftJoinAndSelect('letters.sender', 'sender')
        .leftJoinAndSelect('letters.receiver', 'receiver')
        .getMany();

      return letters;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async sendLetter(sender: User, receiver: User, description: string) {
    try {
      const { raw } = await this.createQueryBuilder('letters')
        .insert()
        .into(Letter)
        .values([
          {
            sender,
            receiver,
            description,
          },
        ])
        .execute();

      if (!raw.affectedRows) {
        throw new InternalServerErrorException(
          '### 정상적으로 저장되지 않았습니다.',
        );
      }

      return raw;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
