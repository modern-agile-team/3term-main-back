import { InternalServerErrorException } from '@nestjs/common';
import { User } from 'src/auth/entity/user.entity';
import { Mailbox } from 'src/mailboxes/entity/mailbox.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Letter } from '../entity/letter.entity';

@EntityRepository(Letter)
export class LetterRepository extends Repository<Letter> {
  async notReadingLetter(mailboxNo) {
    const letter = await this.createQueryBuilder('letters')
      .leftJoinAndSelect('letters.sender', 'sender')
      .leftJoinAndSelect('letters.receiver', 'receiver')
      .leftJoinAndSelect('letters.mailbox', 'mailbox')
      .select([
        'letters.no',
        'letters.description',
        'letters.reading_flag',
        'sender.no',
        'sender.email',
        'receiver.no',
        'receiver.email',
      ])
      .where('letters.mailbox = :mailboxNo', { mailboxNo })
      .andWhere('letters.reading_flag = :isReading', { isReading: false })
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
      throw e;
    }
  }

  async getLetterContent(loginUserNo: number, clickedUserNo: number) {
    try {
      const letterContent = await this.createQueryBuilder('letters')
        .leftJoinAndSelect('letters.sender', 'sender')
        .leftJoinAndSelect('letters.receiver', 'receiver')
        .select([
          'letters.no',
          'letters.description',
          'letters.reading_flag',
          'letters.createdAt',
          'sender.no',
          'receiver.no',
        ])
        .where('letters.sender = :clickedUserNo', { clickedUserNo })
        .andWhere('letters.receiver = :loginUserNo', { loginUserNo })
        .orWhere('letters.sender = :loginUserNo2', {
          loginUserNo2: loginUserNo,
        })
        .andWhere('letters.receiver = :clickedUserNo2', {
          clickedUserNo2: clickedUserNo,
        })
        .orderBy('letters.createdAt', 'ASC')
        .getMany();

      return letterContent;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async sendLetter(
    sender: User,
    receiver: User,
    mailbox: Mailbox,
    description: string,
  ) {
    try {
      const { raw } = await this.createQueryBuilder('letters')
        .insert()
        .into(Letter)
        .values([
          {
            sender,
            receiver,
            mailbox,
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
