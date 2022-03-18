import { CreateUserDto } from 'src/auth/dto/auth-credential.dto';
import { User } from 'src/auth/entity/user.entity';
import { CreateReviewDto } from 'src/reviews/dto/create-review.dto';
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
    const test = await this.createQueryBuilder('schools')
      .select()
      .where('schools.no=:no', { no })
      .getOne();
    console.log(test);
    return school;
  }
}
