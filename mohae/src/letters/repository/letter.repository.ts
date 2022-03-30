import { EntityRepository, Repository } from 'typeorm';
import { SendLetterDto } from '../dto/letter.dto';
import { Letter } from '../entity/letter.entity';

@EntityRepository(Letter)
export class LetterRepository extends Repository<Letter> {
  async findAllLetters() {
    return await this.createQueryBuilder('letters')
      .leftJoinAndSelect('letters.sender', 'sender')
      .leftJoinAndSelect('letters.receiver', 'receiver')
      .getMany();
  }

  async sendLetter(sender, receiver, description) {
    const result = await this.createQueryBuilder('letters')
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

    return result.raw;
  }
}
