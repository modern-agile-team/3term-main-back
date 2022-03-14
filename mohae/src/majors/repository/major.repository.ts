import { EntityRepository, Repository } from 'typeorm';
import { Major } from '../entity/major.entity';

@EntityRepository(Major)
export class MajorRepository extends Repository<Major> {}
