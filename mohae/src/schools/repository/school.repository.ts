import { CreateUserDto } from 'src/auth/dto/auth-credential.dto';
import { User } from 'src/auth/entity/user.entity';
import { CreateReviewDto } from 'src/reviews/dto/create-review.dto';
import { EntityRepository, Repository } from 'typeorm';
import { School } from '../entity/school.entity';

@EntityRepository(School)
export class SchoolRepository extends Repository<School> {}
