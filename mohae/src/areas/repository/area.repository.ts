import { EntityRepository, Repository } from 'typeorm';
import { Areas } from '../entity/areas.entity';

@EntityRepository(Areas)
export class AreasRepository extends Repository<Areas> {}
