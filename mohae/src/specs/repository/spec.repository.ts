import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Spec } from '../entity/spec.entity';

@EntityRepository(Spec)
export class SpecRepository extends Repository<Spec> {
  async registSpec(title, description, photo_url) {
    try {
      const { raw } = await this.createQueryBuilder('spec')
        .insert()
        .into(Spec)
        .values([
          {
            title,
            description,
            photo_url,
          },
        ])
        .execute();

      if (!raw.affectedRows) {
        throw new InternalServerErrorException(
          '### 정상적으로 저장되지 않았습니다.',
        );
      }
      return raw;
    } catch (err) {
      throw err;
    }
  }
}
