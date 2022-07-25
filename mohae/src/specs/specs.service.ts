import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PickType } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entity/user.entity';
import { Spec } from './entity/spec.entity';
import { ErrorConfirm } from 'src/common/utils/error';
import { CreateSpecDto } from './dto/create-spec.dto';
import { UpdateSpecDto } from './dto/update-spec.dto';
import { SpecRepository } from './repository/spec.repository';
import { UserRepository } from 'src/auth/repository/user.repository';
import { SpecPhotoRepository } from 'src/photo/repository/photo.repository';
import { Connection, QueryRunner } from 'typeorm';

export class OneSpec extends PickType(Spec, [
  'no',
  'title',
  'description',
  'specPhotos',
]) {
  nickname?: string;
}

@Injectable()
export class SpecsService {
  constructor(
    @InjectRepository(SpecRepository)
    private readonly specRepository: SpecRepository,

    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,

    @InjectRepository(SpecPhotoRepository)
    private readonly specPhotoRepository: SpecPhotoRepository,

    private readonly connection: Connection,
    private readonly errorConfirm: ErrorConfirm,
  ) {}

  async getOneSpec(specNo: number): Promise<OneSpec> {
    try {
      const { user, ...spec }: Spec = await this.specRepository.getOneSpec(
        specNo,
      );
      spec['userNo'] = user.no;
      spec['nickname'] = user.nickname;
      this.errorConfirm.notFoundError(spec, '해당 스펙이 존재하지 않습니다.');

      return spec;
    } catch (err) {
      throw err;
    }
  }

  async registSpec(
    userNo: number,
    specPhotoUrls: string[],
    createSpecDto: CreateSpecDto,
  ): Promise<void> {
    const queryRunner: QueryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user: User = await this.userRepository.findOne(userNo, {
        relations: ['specs'],
      });

      const specNo: Spec = await queryRunner.manager
        .getCustomRepository(SpecRepository)
        .registSpec(createSpecDto, user);

      if (specPhotoUrls[0] !== 'logo.png') {
        const specPhotos: object[] = specPhotoUrls.map(
          (photoUrl: string, index: number) => {
            return {
              photo_url: photoUrl,
              spec: specNo,
              order: index + 1,
            };
          },
        );
        const savedSpecPhotos: object[] = await queryRunner.manager
          .getCustomRepository(SpecPhotoRepository)
          .saveSpecPhoto(specPhotos);

        if (specPhotos.length !== savedSpecPhotos.length) {
          throw new InternalServerErrorException(
            '스펙 사진 등록 도중 DB관련 오류',
          );
        }

        await queryRunner.manager
          .getCustomRepository(SpecRepository)
          .addSpecPhoto(specNo, savedSpecPhotos);

        if (specNo) {
          await queryRunner.manager
            .getCustomRepository(UserRepository)
            .userRelation(userNo, specNo, 'specs');
        }
      }
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async updateSpec(
    specNo: number,
    updateSpecDto: UpdateSpecDto,
    specPhotoUrls: false | string[],
  ): Promise<void | string[]> {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const spec: Spec = await this.specRepository.getOneSpec(specNo);

      this.errorConfirm.notFoundError(spec, '해당 스펙이 존재하지 않습니다.');

      await queryRunner.manager
        .getCustomRepository(SpecRepository)
        .updateSpec(specNo, updateSpecDto);

      if (specPhotoUrls) {
        const { specPhotos }: Spec = await this.specRepository.findOne(specNo, {
          select: ['no', 'specPhotos'],
          relations: ['specPhotos'],
        });
        if (specPhotos.length) {
          await queryRunner.manager
            .getCustomRepository(SpecPhotoRepository)
            .deleteSpecPhoto(spec.no);
        }
        if (specPhotoUrls[0] !== 'logo.png') {
          const newSpecPhotos: Array<object> = specPhotoUrls.map(
            (photoUrl: string, index: number) => {
              return {
                photo_url: photoUrl,
                spec: specNo,
                order: index + 1,
              };
            },
          );
          await queryRunner.manager
            .getCustomRepository(SpecPhotoRepository)
            .saveSpecPhoto(newSpecPhotos);

          const originSpecPhotosUrl = specPhotos.map((specPhoto) => {
            return specPhoto.photo_url;
          });

          await queryRunner.commitTransaction();
          return originSpecPhotosUrl;
        }
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteSpec(specNo: number, userNo: number): Promise<any> {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const isSpec = await this.specRepository.findOne(specNo, {
        select: ['no', 'user', 'deletedAt'],
        relations: ['user'],
      });
      this.errorConfirm.notFoundError(
        isSpec,
        '스펙 삭제를 중복으로 할 수 없습니다.',
      );

      const { specPhotos }: Spec = await this.specRepository.findOne(specNo, {
        select: ['no', 'specPhotos'],
        relations: ['specPhotos'],
      });

      await queryRunner.manager
        .getCustomRepository(SpecRepository)
        .deleteSpec(specNo, userNo);

      const originSpecPhotosUrl: string[] = specPhotos.map((specPhoto) => {
        return specPhoto.photo_url;
      });

      await queryRunner.manager
        .getCustomRepository(SpecPhotoRepository)
        .deleteSpecPhoto(specNo);

      await queryRunner.commitTransaction();
      return originSpecPhotosUrl;
    } catch (err) {
      throw err;
    }
  }

  async readUserSpec(
    userNo: number,
    take: number,
    page: number,
  ): Promise<Spec[]> {
    try {
      const profileSpecs: Spec[] = await this.specRepository.readUserSpec(
        userNo,
        take,
        page,
      );

      return profileSpecs;
    } catch (err) {
      throw err;
    }
  }

  async comfirmCertification(specNo: number, userNo: number) {
    try {
      const { user }: Spec = await this.specRepository.getOneSpec(specNo);

      if (user.no !== userNo)
        throw new ForbiddenException('스펙의 작성자와 현재 사용자가 다릅니다.');
    } catch (err) {
      throw err;
    }
  }
}
