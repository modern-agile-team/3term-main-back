import { EntityRepository, Repository } from 'typeorm';
import { School } from '../entity/school.entity';

@EntityRepository(School)
export class SchoolRepository extends Repository<School> {
  async findOneSchool(no: number) {
    const school = await this.createQueryBuilder('schools')
      .leftJoinAndSelect('schools.users', 'users')
      .where('schools.no = :no', { no })
      .andWhere('schools.no = users.school')
      .getOne();
    return school;
  }
}
