import { EntityRepository, Repository } from 'typeorm';
import { Faq } from '../entity/faq.entity';

@EntityRepository(Faq)
export class FaqRepository extends Repository<Faq> {}
