import { InternalServerErrorException } from '@nestjs/common';
import { User } from 'src/auth/entity/user.entity';
import {
  DeleteResult,
  EntityRepository,
  InsertResult,
  Repository,
  UpdateResult,
} from 'typeorm';
import { CreateSpecDto } from '../dto/create-spec.dto';
import { Spec } from '../entity/spec.entity';

@EntityRepository(Spec)
export class SpecRepository extends Repository<Spec> {
  async getAllSpec(profileUserNo: number) {
    try {
      const specs = await this.createQueryBuilder('specs')
        .leftJoin('specs.specPhotos', 'specPhotos')
        .leftJoin('specs.user', 'user')
        .select([
          'specs.no',
          'specs.title',
          'specs.description',
          'specPhotos.photo_url',
          'user.no',
        ])
        .where('user.no = :profileUserNo', { profileUserNo })
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
      const specs: Array<Spec> = await this.createQueryBuilder('specs')
        .leftJoin('specs.specPhotos', 'specPhotos')
        .leftJoin('specs.user', 'user')
        .select([
          'specs.no AS no',
          'specs.title AS title',
          'specs.description AS description',
          'specPhotos.photo_url AS photoUrl',
          'user.no AS userNo',
        ])
        .where('user.no = :userNo', { userNo })
        .limit(take)
        .offset((page - 1) * take)
        .groupBy('specs.no')
        .getRawMany();

      return specs;
    } catch (err) {
      throw new InternalServerErrorException(
        `${err}####프로필 스펙 관련 서버 에러입니다`,
      );
    }
  }

  async getOneSpec(specNo: number): Promise<Spec> {
    try {
      const spec = await this.createQueryBuilder('specs')
        .leftJoin('specs.specPhotos', 'specPhotos')
        .leftJoin('specs.user', 'user')
        .select([
          'specs.no',
          'specs.title',
          'specs.description',
          'specPhotos.photo_url',
          'specPhotos.no',
          'user.nickname',
        ])
        .where('specs.no = :specNo', { specNo })
        .getOne();

      return spec;
    } catch (err) {
      throw new InternalServerErrorException(
        `${err}스펙 상세 조회 관련 서버 에러입니다`,
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
      const { raw }: InsertResult = await this.createQueryBuilder('specs')
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
      const { affected }: UpdateResult = await this.createQueryBuilder('specs')
        .update(Spec)
        .set(updateSpecDto)
        .where('no = :specNo', { specNo })
        .execute();

      return affected;
    } catch (err) {
      throw new InternalServerErrorException(
        `스펙 업데이트 도중 발생한 서버에러${err}`,
      );
    }
  }

  async deleteSpec(specNo: number, userNo: number): Promise<number> {
    try {
      const { affected }: DeleteResult = await this.createQueryBuilder('specs')
        .softDelete()
        .from(Spec)
        .where('no = :specNo', { specNo })
        .andWhere('user_no = :userNo', { userNo })
        .execute();

      return affected;
    } catch (err) {
      throw new InternalServerErrorException(
        '스펙 삭제 도중 발생한 서버에러',
        err,
      );
    }
  }
}
