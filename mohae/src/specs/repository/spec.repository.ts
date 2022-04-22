import { InternalServerErrorException } from '@nestjs/common';
import { onErrorResumeNext } from 'rxjs/operators';
import { EntityRepository, Repository } from 'typeorm';
import { Spec } from '../entity/spec.entity';

@EntityRepository(Spec)
export class SpecRepository extends Repository<Spec> {
  async getAllSpec(no: number) {
    try {
      const specs = await this.createQueryBuilder('spec')
        .leftJoinAndSelect('spec.user', 'user')
        .leftJoinAndSelect('spec.specPhoto', 'specPhoto')
        .select([
          'spec.no',
          'spec.title',
          'spec.description',
          'specPhoto.photo_url',
          'user.no',
        ])
        .where('user.no = :no', { no })
        .andWhere('spec.no = specPhoto.spec')
        .getMany();

      return specs;
    } catch (err) {
      throw new InternalServerErrorException(
        '스펙 전체 조회 관련 서버 에러입니다',
      );
    }
  }

  async getOneSpec(no: number) {
    try {
      const spec = await this.createQueryBuilder('spec')
        .leftJoinAndSelect('spec.specPhoto', 'specPhoto')
        .select([
          'spec.no',
          'spec.title',
          'spec.description',
          'specPhoto.photo_url',
          'specPhoto.no',
          'spec.createdAt',
          'spec.latestUpdateSpec',
        ])
        .where('spec.no = :no', { no })
        .andWhere('spec.no = specPhoto.spec')
        .getOne();

      return spec;
    } catch (err) {
      throw new InternalServerErrorException(
        '스펙 상세 조회 관련 서버 에러입니다',
        err,
      );
    }
  }

  async registSpec({ title, description }, user) {
    try {
      const { raw } = await this.createQueryBuilder('spec')
        .insert()
        .into(Spec)
        .values([
          {
            title,
            description,
            user,
          },
        ])
        .execute();

      return raw.insertId;
    } catch (err) {
      throw new InternalServerErrorException(
        '### 정상적으로 저장되지 않았습니다.',
      );
    }
  }

  async updateSpec(no, deletedNullSpec) {
    try {
      const { affected } = await this.createQueryBuilder('spec')
        .update(Spec)
        .set(deletedNullSpec)
        .where('no = :no', { no })
        .execute();

      return affected;
    } catch (err) {
      throw new InternalServerErrorException(
        '스팩 업데이트 도중 발생한 서버에러',
        err,
      );
    }
  }

  async deleteSpec(no) {
    try {
      const { affected } = await this.createQueryBuilder('spec')
        .softDelete()
        .from(Spec)
        .where('no = :no', { no })
        .execute();

      return affected;
    } catch (err) {
      throw new InternalServerErrorException(
        '스팩 삭제 도중 발생한 서버에러',
        err,
      );
    }
  }
}
