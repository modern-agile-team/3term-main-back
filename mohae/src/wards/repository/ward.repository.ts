import { EntityRepository, Repository } from 'typeorm';
import { Ward } from '../entity/wards.entity';

@EntityRepository(Ward)
export class WardsRepository extends Repository<Ward> {}
