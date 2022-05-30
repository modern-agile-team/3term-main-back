import { InternalServerErrorException } from '@nestjs/common';
import { User } from 'src/auth/entity/user.entity';
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
  async getAllSpec(profileUserNo: number) {
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
        .where('user.no = :profileUserNo', { profileUserNo })
        .andWhere('spec.no = specPhotos.spec')
        .getMany();

      return specs;
    } catch (err) {
      throw new InternalServerErrorException(
        `${err}####스펙 전체 조회 관련 서버 에러입니다`,
      );
    }
  }

  async readUserSpec(
    userNo: number,
    take: number,
    page: number,
  ): Promise<Array<Spec>> {
    try {
      const specs: Array<Spec> = await this.createQueryBuilder('spec')
        .leftJoin('spec.specPhotos', 'specPhotos')
        .leftJoin('spec.user', 'user')
        .select([
          'spec.no',
          'spec.title',
          'spec.description',
          'specPhotos.photo_url',
          'user.no',
        ])
        .where('user.no = :userNo', { userNo })
        .andWhere('spec.no = specPhotos.spec')
        .take(take)
        .skip(take * (page - 1))
        .getMany();

      return specs;
    } catch (err) {
      throw new InternalServerErrorException(
        `${err}####프로필 스펙 관련 서버 에러입니다`,
      );
    }
  }

  async getOneSpec(specNo: number) {
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
        .where('spec.no = :specNo', { specNo })
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

  async addSpecPhoto(specNo: Spec, savedSpecPhotos: Array<object>) {
    try {
      await this.createQueryBuilder()
        .relation(Spec, 'specPhotos')
        .of(specNo)
        .add(savedSpecPhotos);
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

  async updateSpec(specNo: number, updateSpecDto: object): Promise<number> {
    try {
      const { affected }: UpdateResult = await this.createQueryBuilder('spec')
        .update(Spec)
        .set(updateSpecDto)
        .where('no = :specNo', { specNo })
        .execute();

      return affected;
    } catch (err) {
      throw new InternalServerErrorException(
        `스팩 업데이트 도중 발생한 서버에러${err}`,
      );
    }
  }

  async deleteSpec(specNo: number): Promise<number> {
    try {
      const { affected }: DeleteResult = await this.createQueryBuilder('spec')
        .softDelete()
        .from(Spec)
        .where('no = :specNo', { specNo })
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
