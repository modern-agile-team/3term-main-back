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
}
