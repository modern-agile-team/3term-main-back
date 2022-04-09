import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { SpecPhoto } from '../entity/photo.entity';

@EntityRepository(SpecPhoto)
export class SpecPhotoRepository extends Repository<SpecPhoto> {
  async saveSpecPhoto(photo_url, spec) {
    try {
      const { raw } = await this.createQueryBuilder('specPhoto')
        .insert()
        .into(SpecPhoto)
        .values([{ photo_url, spec }])
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

  async updatePhoto(no, new_url) {
    try {
      const { affected } = await this.createQueryBuilder('specPhoto')
        .update(SpecPhoto)
        .set({ photo_url: new_url })
        .where('no = :no', { no })
        .execute();

      if (!affected) {
        throw new InternalServerErrorException(
          '스펙 사진 업데이트 중 오류가 발생 하였습니다.(아마 specPhoto no 문제일 가능성 매우높음)',
        );
      }

      return affected;
    } catch (err) {
      throw err;
    }
  }
}
