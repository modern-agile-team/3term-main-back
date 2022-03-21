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

    console.log(school);
    return school;
  }
}
