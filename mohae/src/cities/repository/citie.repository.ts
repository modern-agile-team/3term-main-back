import { EntityRepository, Repository } from 'typeorm';
import { City } from '../entity/cities.entity';

@EntityRepository(City)
export class CitiesRepository extends Repository<City> {}
