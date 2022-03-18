import { EntityRepository, Repository } from 'typeorm';
import { Major } from '../entity/major.entity';

@EntityRepository(Major)
export class MajorRepository extends Repository<Major> {
  async findOneMajor(no: number) {
    const major = await this.createQueryBuilder('majors')
      .leftJoinAndSelect('majors.users', 'users')
      .where('majors.no = :no', { no })
      .andWhere('majors.no = users.major')
      .getOne();
    return major;
  }
}
