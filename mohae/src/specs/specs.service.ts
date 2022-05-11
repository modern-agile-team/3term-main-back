import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError, throwIfEmpty } from 'rxjs';
import { UserRepository } from 'src/auth/repository/user.repository';
import { SpecPhotoRepository } from 'src/photo/repository/photo.repository';
import { ErrorConfirm } from 'src/utils/error';
import { UpdateResult } from 'typeorm';
import { UpdateSpecDto } from './dto/spec.dto';
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
  async getAllSpec(no: number) {
    try {
      const user = await this.userRepository.findOne(no);
      const specs = await this.specRepository.getAllSpec(no);
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
      const spec = await this.specRepository.getOneSpec(no);

      this.errorConfirm.notFoundError(spec, '해당 스펙이 존재하지 않습니다.');
      return spec;
    } catch (err) {
      throw err;
    }
  }

  async registSpec(createSpecDto) {
    try {
      const { userNo, specPhoto } = createSpecDto;
      const user = await this.userRepository.findOne(userNo, {
        relations: ['specs'],
      });
      const specNo = await this.specRepository.registSpec(createSpecDto, user);

      const spec = await this.specRepository.findOne(specNo, {
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
        const specPhotoNo = await this.specPhotoRepository.saveSpecPhoto(
          photo,
          spec,
        );
        const specPhotoRepo = await this.specPhotoRepository.findOne(
          specPhotoNo,
        );
        spec.specPhotos.push(specPhotoRepo);
      }

      if (spec) {
        user.specs.push(spec);
      }
    } catch (err) {
      throw new InternalServerErrorException(
        ` ${err}####스펙등록 중 발생한 서버 에러입니다.`,
      );
    }
  }

  async updateSpec(specNo, updateSpec) {
    try {
      const spec = await this.specRepository.getOneSpec(specNo);

      this.errorConfirm.notFoundError(spec, '해당 스펙이 존재하지 않습니다.');

      const specKeys = Object.keys(updateSpec);
      const deletedNullSpec = {};

      specKeys.forEach((item) => {
        updateSpec[item] ? (deletedNullSpec[item] = updateSpec[item]) : 0;
      });

      if (deletedNullSpec['photo_url']) {
        const specPhotoNo = Object.values(deletedNullSpec['photo_url']);

        function getKeyByValue(object, value) {
          return Object.keys(object).find((key) => object[key] === value);
        }

        for (const photoNo of specPhotoNo) {
          const judgeNo = await this.specPhotoRepository.getSpecNo(photoNo);
          if (judgeNo !== specNo)
            throw new UnauthorizedException(
              '스펙 번호와 스펙사진의 스펙번호가 맞지 않습니다.',
            );
        }

        for (const no of specPhotoNo) {
          const new_url = getKeyByValue(deletedNullSpec['photo_url'], no);
          await this.specPhotoRepository.updatePhoto(no, new_url);
        }
        delete deletedNullSpec['photo_url'];
      }
      const isUpdate = await this.specRepository.updateSpec(
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

  async deleteSpec(specNo) {
    try {
      const isDelete = await this.specRepository.deleteSpec(specNo);

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
