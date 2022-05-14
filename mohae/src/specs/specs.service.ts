import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { throws } from 'assert';
import { User } from 'src/auth/entity/user.entity';
import { UserRepository } from 'src/auth/repository/user.repository';
import { SpecPhoto } from 'src/photo/entity/photo.entity';
import { SpecPhotoRepository } from 'src/photo/repository/photo.repository';
import { ErrorConfirm } from 'src/utils/error';
import { CreateSpecDto, UpdateSpecDto } from './dto/spec.dto';
import { Spec } from './entity/spec.entity';
import { SpecRepository } from './repository/spec.repository';

@Injectable()
export class SpecsService {
  constructor(
    @InjectRepository(SpecRepository)
    private specRepository: SpecRepository,
    private userRepository: UserRepository,
    private specPhotoRepository: SpecPhotoRepository,
    private errorConfirm: ErrorConfirm,
  ) {}
  async getAllSpec(no: number): Promise<any> {
    try {
      const user: User = await this.userRepository.findOne(no);
      const specs: Array<Spec> = await this.specRepository.getAllSpec(no);
      this.errorConfirm.notFoundError(user, '존재하지 않는 유저 입니다.');
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
    try {
      const { userNo, specPhoto }: CreateSpecDto = createSpecDto;
      const user: User = await this.userRepository.findOne(userNo, {
        relations: ['specs'],
      });
      const specNo: number = await this.specRepository.registSpec(
        createSpecDto,
        user,
      );

      const spec: Spec = await this.specRepository.findOne(specNo, {
        relations: ['specPhotos'],
      });
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
        const specPhotoNo: number =
          await this.specPhotoRepository.saveSpecPhoto(photo, spec);
        const specPhotoRepo: SpecPhoto = await this.specPhotoRepository.findOne(
          specPhotoNo,
        );
        await this.specRepository.addSpecPhoto(spec.no, specPhotoRepo);
      }

      if (spec) {
        await this.userRepository.userRelation(userNo, spec, 'specs');
      }
    } catch (err) {
      throw new InternalServerErrorException(
        ` ${err}####스펙등록 중 발생한 서버 에러입니다.`,
      );
    }
  }

  async updateSpec(specNo: number, updateSpec: UpdateSpecDto): Promise<void> {
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
          await this.specPhotoRepository.updatePhoto(no, new_url);
        }
        delete deletedNullSpec['photo_url'];
      }
      const isUpdate: number = await this.specRepository.updateSpec(
        specNo,
        deletedNullSpec,
      );
      if (!isUpdate) {
        throw new InternalServerErrorException(
          '스팩 업데이트가 제대로 이루어지지 않았습니다.',
        );
      }
    } catch (err) {
      throw err;
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
