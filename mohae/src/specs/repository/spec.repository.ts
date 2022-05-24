import { InternalServerErrorException } from '@nestjs/common';
import { onErrorResumeNext } from 'rxjs/operators';
import { User } from 'src/auth/entity/user.entity';
import { SpecPhoto } from 'src/photo/entity/photo.entity';
import { SpecPhotoRepository } from 'src/photo/repository/photo.repository';
import {
  DeleteResult,
  EntityRepository,
  InsertResult,
  Repository,
  UpdateResult,
} from 'typeorm';
import { CreateSpecDto } from '../dto/spec.dto';
import { Spec } from '../entity/spec.entity';

@EntityRepository(Spec)
export class SpecRepository extends Repository<Spec> {
  async getAllSpec(no: number) {
    try {
      const specs = await this.createQueryBuilder('spec')
        .leftJoin('spec.specPhotos', 'specPhotos')
        .leftJoin('spec.user', 'user')
        .select([
          'spec.no',
          'spec.title',
          'spec.description',
          'specPhotos.photo_url',
          'user.no',
        ])
        .where('user.no = :no', { no })
        .andWhere('spec.no = specPhotos.spec')
        .getMany();

      return specs;
    } catch (err) {
      throw new InternalServerErrorException(
        `${err}####스펙 전체 조회 관련 서버 에러입니다`,
      );
    }
  }

  async getOneSpec(no: number) {
    try {
      const spec = await this.createQueryBuilder('spec')
        .leftJoinAndSelect('spec.specPhotos', 'specPhotos')
        .select([
          'spec.no',
          'spec.title',
          'spec.description',
          'specPhotos.photo_url',
          'specPhotos.no',
          'spec.createdAt',
          'spec.latestUpdateSpec',
        ])
        .where('spec.no = :no', { no })
        .andWhere('spec.no = specPhotos.spec')
        .getOne();

      return spec;
    } catch (err) {
      throw new InternalServerErrorException(
        '스펙 상세 조회 관련 서버 에러입니다',
        err,
      );
    }
  }

  async addSpecPhoto(specNo: Spec, specPhotoNo: Array<object>) {
    try {
      await this.createQueryBuilder()
        .relation(Spec, 'specPhotos')
        .of(specNo)
        .add(specPhotoNo);
    } catch (err) {
      throw new InternalServerErrorException(
        `${err} 스펙 사진 저장 도중 발생한 서버에러`,
      );
    }
  }

  async registSpec(
    { title, description }: CreateSpecDto,
    user: User,
  ): Promise<Spec> {
    try {
      const { raw }: InsertResult = await this.createQueryBuilder('spec')
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

  async updateSpec(no: number, deletedNullSpec: object): Promise<number> {
    try {
      const { affected }: UpdateResult = await this.createQueryBuilder('spec')
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

  async deleteSpec(no: number): Promise<number> {
    try {
      const { affected }: DeleteResult = await this.createQueryBuilder('spec')
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
