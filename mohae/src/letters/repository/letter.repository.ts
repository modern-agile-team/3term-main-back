import { InternalServerErrorException } from '@nestjs/common';
import { User } from 'src/auth/entity/user.entity';
import { Mailbox } from 'src/mailboxes/entity/mailbox.entity';
import { EntityRepository, Repository } from 'typeorm';
import { SendLetterDto } from '../dto/letter.dto';
import { Letter } from '../entity/letter.entity';

@EntityRepository(Letter)
export class LetterRepository extends Repository<Letter> {
  async notReadingLetter(myNo: number, youNo: number) {
    const letter = await this.createQueryBuilder('letters')
      .leftJoinAndSelect('letters.sender', 'sender')
      .leftJoinAndSelect('letters.receiver', 'receiver')
      .select([
        'letters.no',
        'letters.description',
        'letters.reading_flag',
        'sender.no',
        'sender.email',
        'receiver.no',
        'receiver.email',
      ])
      .where('letters.reading_flag = :isReading', { isReading: false })
      .andWhere('letters.sender = :youNo', { youNo })
      .andWhere('letters.receiver = :myNo', { myNo })
      .getMany();

    return letter;
  }

  async updateReading(no: number) {
    try {
      const { affected } = await this.createQueryBuilder()
        .update(Letter)
        .set({ reading_flag: true })
        .where('letters.no = :no', { no })
        .execute();

      return affected;
    } catch (e) {
      console.log(e);
    }
  }

  async 전송하고받은쪽지인데함수명바꿔야함(myNo: number, youNo: number) {
    try {
      const 쪽지내용인데변수명바꿔야함 = await this.createQueryBuilder(
        'letters',
      )
        .leftJoinAndSelect('letters.sender', 'sender')
        .leftJoinAndSelect('letters.receiver', 'receiver')
        .select([
          'letters.no',
          'letters.description',
          'letters.createdAt',
          'sender.no',
          'receiver.no',
        ])
        .where('letters.sender = :youNo', { youNo })
        .andWhere('letters.receiver = :myNo', { myNo })
        .orWhere('letters.sender = :mySendNo', { mySendNo: myNo })
        .andWhere('letters.receiver = :youReceivedNo', { youReceivedNo: youNo })
        .orderBy('letters.createdAt', 'ASC')
        .getMany();

      return 쪽지내용인데변수명바꿔야함;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async sendLetter(
    sender: User,
    receiver: User,
    description: string,
    mailbox: Mailbox,
  ) {
    try {
      const { raw } = await this.createQueryBuilder('letters')
        .insert()
        .into(Letter)
        .values([
          {
            sender,
            receiver,
            description,
            mailbox,
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
