import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entity/user.entity';
import { UserRepository } from 'src/auth/repository/user.repository';
import { SpecPhoto } from 'src/photo/entity/photo.entity';
import { SpecPhotoRepository } from 'src/photo/repository/photo.repository';
import { ErrorConfirm } from 'src/common/utils/error';
import { CreateSpecDto, UpdateSpecDto } from './dto/spec.dto';
import { Spec } from './entity/spec.entity';
import { SpecRepository } from './repository/spec.repository';
import { Connection } from 'typeorm';

@Injectable()
export class SpecsService {
  constructor(
    @InjectRepository(SpecRepository)
    private specRepository: SpecRepository,

    @InjectRepository(UserRepository)
    private userRepository: UserRepository,

    @InjectRepository(SpecPhotoRepository)
    private specPhotoRepository: SpecPhotoRepository,

    private connection: Connection,
    private errorConfirm: ErrorConfirm,
  ) {}
  async getAllSpec(no: number): Promise<any> {
    try {
      const specs: Array<Spec> = await this.specRepository.getAllSpec(no);
      if (specs.length === 0) {
        return '현재 등록된 스펙이 없습니다.';
      }
      return specs;
    } catch (err) {
      throw err;
    }
  }

  async getOneSpec(no: number) {
    try {
      const spec: Spec = await this.specRepository.getOneSpec(no);

      this.errorConfirm.notFoundError(spec, '해당 스펙이 존재하지 않습니다.');
      return spec;
    } catch (err) {
      throw err;
    }
  }

  async registSpec(createSpecDto: CreateSpecDto): Promise<void> {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { userNo, specPhoto }: CreateSpecDto = createSpecDto;
      const user: User = await this.userRepository.findOne(userNo, {
        relations: ['specs'],
      });

      const specNo: Spec = await queryRunner.manager
        .getCustomRepository(SpecRepository)
        .registSpec(createSpecDto, user);
      if (!userNo) {
        throw new UnauthorizedException(
          `${userNo}에 해당하는 유저가 존재하지 않습니다.`,
        );
      }
      if (specPhoto.length === 0) {
        throw new BadRequestException(
          '스펙의 사진이 없다면 null 이라도 넣어주셔야 스펙 등록이 가능합니다.',
        );
      }
      for (const photo of specPhoto) {
        const specPhotoNo: number = await queryRunner.manager
          .getCustomRepository(SpecPhotoRepository)
          .saveSpecPhoto(photo, specNo);
        const specPhotoRepo: SpecPhoto = await this.specPhotoRepository.findOne(
          specPhotoNo,
        );
        await queryRunner.manager
          .getCustomRepository(SpecRepository)
          .addSpecPhoto(specNo, specPhotoRepo);
      }

      if (specNo) {
        await queryRunner.manager
          .getCustomRepository(UserRepository)
          .userRelation(userNo, specNo, 'specs');
      }
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async updateSpec(specNo: number, updateSpec: UpdateSpecDto): Promise<void> {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const spec: Spec = await this.specRepository.getOneSpec(specNo);

      this.errorConfirm.notFoundError(spec, '해당 스펙이 존재하지 않습니다.');

      const specKeys: Array<string> = Object.keys(updateSpec);
      const deletedNullSpec: object = {};

      specKeys.forEach((item) => {
        updateSpec[item] ? (deletedNullSpec[item] = updateSpec[item]) : 0;
      });

      if (deletedNullSpec['photo_url']) {
        const specPhotoNo: Array<any> = Object.values(
          deletedNullSpec['photo_url'],
        );

        function getKeyByValue(object: object, value: number) {
          return Object.keys(object).find((key) => object[key] === value);
        }

        for (const photoNo of specPhotoNo) {
          const judgeNo: number = await this.specPhotoRepository.getSpecNo(
            photoNo,
          );
          if (judgeNo !== specNo)
            throw new UnauthorizedException(
              '스펙 번호와 스펙사진의 스펙번호가 맞지 않습니다.',
            );
        }

        for (const no of specPhotoNo) {
          const new_url: string = getKeyByValue(
            deletedNullSpec['photo_url'],
            no,
          );
          await queryRunner.manager
            .getCustomRepository(SpecPhotoRepository)
            .updatePhoto(no, new_url);
        }
        delete deletedNullSpec['photo_url'];
      }
      const isUpdate: number = await queryRunner.manager
        .getCustomRepository(SpecRepository)
        .updateSpec(specNo, deletedNullSpec);

      if (!isUpdate) {
        throw new InternalServerErrorException(
          '스팩 업데이트가 제대로 이루어지지 않았습니다.',
        );
      }
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteSpec(specNo: number): Promise<number> {
    try {
      const isDelete: number = await this.specRepository.deleteSpec(specNo);

      if (!isDelete) {
        throw new InternalServerErrorException(
          '스팩 삭제가 제대로 이루어지지 않았습니다.',
        );
      }
      return isDelete;
    } catch (err) {
      throw err;
    }
  }
}
