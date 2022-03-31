import { EntityRepository, Repository } from 'typeorm';
import { MailBox } from '../entity/mailbox.entity';

@EntityRepository(MailBox)
export class MailBoxRepository extends Repository<MailBox> {}
