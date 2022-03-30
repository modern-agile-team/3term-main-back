import { EntityRepository, Repository } from 'typeorm';
import { SendLetterDto } from '../dto/letter.dto';
import { Letter } from '../entity/letter.entity';

@EntityRepository(Letter)
export class LetterRepository extends Repository<Letter> {
  async findAllLetters() {
    return await this.find();
  }

  async sendLetter(sendLetterDto: SendLetterDto) {
    const { description } = sendLetterDto;
    const result = this.createQueryBuilder('letters')
      .insert()
      .into(Letter)
      .values([
        {
          description,
        },
      ])
      .execute();

    return result;
  }
}
