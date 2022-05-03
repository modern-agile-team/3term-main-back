import { InternalServerErrorException } from '@nestjs/common';
import { User } from 'src/auth/entity/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { School } from '../entity/school.entity';

@EntityRepository(School)
export class SchoolRepository extends Repository<School> {
  async findOneSchool(no: number) {
    const school = await this.createQueryBuilder('schools')
      .leftJoinAndSelect('schools.users', 'users')
      .select([
        'schools.no',
        'schools.name',
        'users.no',
        'users.email',
        'users.name',
        'users.nickname',
      ])
      .where('schools.no = :no', { no })
      .andWhere('schools.no = users.school')
      .getOne();
    return school;
  }

  async addUser(schoolNo: number, user: User) {
    try {
      await this.createQueryBuilder()
        .relation(School, 'users')
        .of(schoolNo)
        .add(user);
    } catch (e) {
      throw new InternalServerErrorException(`
        ${e} ### 유저 회원 가입도중 학교정보 저장 관련 알 수없는 서버에러입니다. `);
    }
  }
}
