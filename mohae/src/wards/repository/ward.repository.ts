import { EntityRepository, Repository } from 'typeorm';
import { Wards } from '../entity/wards.entity';

@EntityRepository(Wards)
export class WardsRepository extends Repository<Wards> {}
