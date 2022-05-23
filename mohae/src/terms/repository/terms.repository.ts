import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, InsertResult, Repository } from 'typeorm';
import { Terms, TermsUser } from '../entity/terms.entity';

@EntityRepository(Terms)
export class TermsReporitory extends Repository<Terms> {
  async addUser(termsNo: number, termsUserNum: number): Promise<void> {
    try {
      await this.createQueryBuilder()
        .relation(Terms, 'userTerms')
        .of(termsNo)
        .add(termsUserNum);
    } catch (e) {
      throw new InternalServerErrorException(`
            ${e} ### 회원 가입도중 약관 저장 관계 형성도중 알 수 없는 서버에러입니다. `);
    }
  }
}

@EntityRepository(TermsUser)
export class TermsUserReporitory extends Repository<TermsUser> {
  async addTermsUser(termsArr: Array<object>): Promise<Array<object>> {
    try {
      const result: InsertResult = await this.createQueryBuilder('terms_user')
        .insert()
        .into(TermsUser)
        .values(termsArr)
        .execute();
      return result.identifiers;
    } catch (err) {
      throw err;
    }
  }
}
