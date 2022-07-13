import { InternalServerErrorException } from '@nestjs/common';
import { User } from 'src/auth/entity/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Major } from '../entity/major.entity';

@EntityRepository(Major)
export class MajorRepository extends Repository<Major> {
  async findOneMajor(no: number) {
    const major = await this.createQueryBuilder('majors')
      .leftJoinAndSelect('majors.users', 'users')
      .select([
        'majors.no',
        'majors.name',
        'users.no',
        'users.email',
        'users.name',
        'users.nickname',
      ])
      .where('majors.no = :no', { no })
      .andWhere('majors.no = users.major')
      .getOne();
    return major;
  }

  async addUser(majorNo: Major, user: User) {
    try {
      await this.createQueryBuilder()
        .relation(Major, 'users')
        .of(majorNo)
        .add(user);
    } catch (e) {
      throw new InternalServerErrorException(`
        ${e} ### 유저 회원 가입도중 전공정보 저장 관련 알 수없는 서버에러입니다. `);
    }
  }
}
