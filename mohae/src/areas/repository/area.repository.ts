import { EntityRepository, Repository } from 'typeorm';
import { Area } from '../entity/areas.entity';

@EntityRepository(Area)
export class AreasRepository extends Repository<Area> {}
