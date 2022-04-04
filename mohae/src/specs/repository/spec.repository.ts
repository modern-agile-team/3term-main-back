import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, getConnection, Repository } from 'typeorm';
import { Spec } from '../entity/spec.entity';

@EntityRepository(Spec)
export class SpecRepository extends Repository<Spec> {
  async getAllSpec({no}) {
    const specs = await this.createQueryBuilder('spec')
    .select([
      'no',
      'title',
      'description',
    ])
    .where('spec.user_no = :no', {no})
    .getMany();

    return specs;
  }

  async registSpec(title, description, photo_url, user) {
    try {
      const { raw } = await this.createQueryBuilder('spec')
        .insert()
        .into(Spec)
        .values([
          {
            title,
            description,
            photo_url,
            user,
          },
        ])
        .execute();
      if (!raw) {
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
