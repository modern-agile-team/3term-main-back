import {
  BadRequestException,
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
import { AwsService } from 'src/aws/aws.service';

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
    private readonly awsService: AwsService,
  ) {}

  async getOneSpec(specNo: number): Promise<OneSpec> {
    try {
      const spec: Spec = await this.specRepository.getOneSpec(specNo);

      this.errorConfirm.notFoundError(spec, '해당 스펙이 존재하지 않습니다.');

      const { user } = spec;

      delete spec.user;
      spec['userNo'] = user.no;
      spec['nickname'] = user.nickname;

      return spec;
    } catch (err) {
      throw err;
    }
  }

  async registSpec(
    userNo: number,
    createSpecDto: CreateSpecDto,
    files: Express.Multer.File[],
  ): Promise<void> {
    const queryRunner: QueryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (!files.length)
        throw new BadRequestException(
          '사진을 선택하지 않은 경우 기본사진을 넣어주셔야 스펙 등록이 가능 합니다.',
        );

      const specPhotoUrls: string[] = await this.awsService.uploadSpecFileToS3(
        'spec',
        files,
      );
      const user: User = await this.userRepository.findOne(userNo, {
        relations: ['specs'],
      });
      const specNo: Spec = await queryRunner.manager
        .getCustomRepository(SpecRepository)
        .registSpec(createSpecDto, user);

      if (specPhotoUrls[0] !== 'logo.png') {
        await this.registSpecPhotos(specNo, specPhotoUrls, queryRunner);
      }
      await queryRunner.manager
        .getCustomRepository(UserRepository)
        .userRelation(userNo, specNo, 'specs');

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async registSpecPhotos(
    specNo: Spec,
    specPhotoUrls: string[],
    queryRunner: QueryRunner,
  ) {
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

    await queryRunner.manager
      .getCustomRepository(SpecRepository)
      .addSpecPhoto(specNo, savedSpecPhotos);
  }

  async updateSpec(
    userNo: number,
    specNo: number,
    updateSpecDto: UpdateSpecDto,
    files: Express.Multer.File[],
  ): Promise<void | string[]> {
    const queryRunner: QueryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const spec: Spec = await this.comfirmCertification(specNo, userNo);

      await queryRunner.manager
        .getCustomRepository(SpecRepository)
        .updateSpec(specNo, updateSpecDto);

      const specPhotoUrls: false | string[] =
        files.length === 0
          ? false
          : await this.awsService.uploadSpecFileToS3('spec', files);

      if (specPhotoUrls) {
        const originSpecPhotoUrls = await this.updateSpecPhotos(
          spec,
          specPhotoUrls,
          queryRunner,
        );

        await this.awsService.deleteSpecS3Object(originSpecPhotoUrls);
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async updateSpecPhotos(
    spec: Spec,
    specPhotoUrls: string[],
    queryRunner: QueryRunner,
  ) {
    const { specPhotos } = spec;
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
            spec: spec.no,
            order: index + 1,
          };
        },
      );
      await queryRunner.manager
        .getCustomRepository(SpecPhotoRepository)
        .saveSpecPhoto(newSpecPhotos);
    }
    const originSpecPhotoUrls = specPhotos.map((specPhoto) => {
      return specPhoto.photo_url;
    });
    return originSpecPhotoUrls;
  }

  async deleteSpec(specNo: number, userNo: number): Promise<any> {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { specPhotos } = await this.comfirmCertification(specNo, userNo);

      const originSpecPhotoUrls: string[] = specPhotos.map((specPhoto) => {
        return specPhoto.photo_url;
      });

      await queryRunner.manager
        .getCustomRepository(SpecRepository)
        .deleteSpec(specNo, userNo);
      await queryRunner.manager
        .getCustomRepository(SpecPhotoRepository)
        .deleteSpecPhoto(specNo);
      if (originSpecPhotoUrls) {
        await this.awsService.deleteSpecS3Object(originSpecPhotoUrls);
      }
      await queryRunner.commitTransaction();
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

  async comfirmCertification(specNo: number, userNo: number): Promise<Spec> {
    try {
      const spec: Spec = await this.specRepository.getOneSpec(specNo);
      this.errorConfirm.notFoundError(spec, '존재하지 않는 스펙입니다.');

      if (spec.user.no !== userNo)
        throw new ForbiddenException('스펙의 작성자와 현재 사용자가 다릅니다.');

      return spec;
    } catch (err) {
      throw err;
    }
  }
}
