import { EntityRepository, Repository } from 'typeorm';
import { Cities } from '../entity/cities.entity';

@EntityRepository(Cities)
export class CitiesRepository extends Repository<Cities> {}
