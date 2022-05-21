import { InternalServerErrorException } from '@nestjs/common';
import { User } from 'src/auth/entity/user.entity';
import { EntityRepository, InsertResult, Repository } from 'typeorm';
import { Terms, TermsUser } from '../entity/terms.entity';

@EntityRepository(Terms)
export class TermsReporitory extends Repository<Terms> {
  async addUser(no: User, termsUserNo: object) {
    try {
      await this.createQueryBuilder()
        .relation(Terms, 'userTerms')
        .of(no)
        .add(termsUserNo);
    } catch (e) {
      throw new InternalServerErrorException(`
            ${e} ### 유저 회원 가입도중 약관 저장 관련 알 수없는 서버에러입니다. `);
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
