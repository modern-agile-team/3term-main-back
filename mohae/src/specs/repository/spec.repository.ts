import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Spec } from '../entity/spec.entity';

@EntityRepository(Spec)
export class SpecRepository extends Repository<Spec> {
  async getAllSpec(no: number) {
    try {
      const specs = await this.createQueryBuilder('spec')
        .leftJoinAndSelect('spec.user', 'user')
        .select([
          'spec.no',
          'spec.title',
          'spec.description',
          'spec.photo_url',
          'user.no',
        ])
        .where('user.no = :no', { no })
        .getMany();

      return specs;
    } catch (err) {
      throw new InternalServerErrorException(
        '스펙 전체 조회 관련 서버 에러입니다',
      );
    }
  }

  async registSpec({ title, description, photo_url }, user) {
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
