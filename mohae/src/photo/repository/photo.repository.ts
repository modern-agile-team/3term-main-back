import { InternalServerErrorException } from '@nestjs/common';
import {
  DeleteResult,
  EntityRepository,
  InsertResult,
  Repository,
} from 'typeorm';
import { BoardPhoto } from '../entity/board.photo.entity';
import { SpecPhoto } from '../entity/spec.photo.entity';
import { ProfilePhoto } from '../entity/profile.photo.entity';
import { User } from 'src/auth/entity/user.entity';
import { Profile } from 'aws-sdk/clients/mediapackage';

@EntityRepository(SpecPhoto)
export class SpecPhotoRepository extends Repository<SpecPhoto> {
  async saveSpecPhoto(specPhotos: Array<object>): Promise<Array<object>> {
    try {
      const result: InsertResult = await this.createQueryBuilder('spec_photos')
        .insert()
        .into(SpecPhoto)
        .values(specPhotos)
        .execute();

      return result.identifiers;
    } catch (err) {
      throw new InternalServerErrorException(
        `스펙 사진 저장도중 에러가 발생 하였습니다.${err}`,
      );
    }
  }

  async deleteBeforePhoto(specNo: number): Promise<void> {
    try {
      await this.createQueryBuilder('spec_photos')
        .delete()
        .from(SpecPhoto)
        .where('spec_no = :specNo', { specNo })
        .execute();
    } catch (err) {
      throw err;
    }
  }

  async getSpecNo(no: number): Promise<number> {
    try {
      const { spec }: any = await this.createQueryBuilder('spec_photos')
        .leftJoinAndSelect('spec_photos.spec', 'spec')
        .select(['specPhoto.no', 'spec.no'])
        .where('specPhoto.no = :no', { no })
        .getOne();

      return spec.no;
    } catch (err) {
      throw new InternalServerErrorException(
        `스펙 번호 가져오기 도중 오류가 발생 하였습니다.${err}`,
      );
    }
  }
}

@EntityRepository(BoardPhoto)
export class BoardPhotoRepository extends Repository<BoardPhoto> {
  async createBoardPhoto(boardPhotos: Array<object>): Promise<Array<object>> {
    try {
      const result: InsertResult = await this.createQueryBuilder('boardPhotos')
        .insert()
        .into(BoardPhoto)
        .values(boardPhotos)
        .execute();

      return result.identifiers;
    } catch (err) {
      throw new InternalServerErrorException(
        `게시글 사진 저장도중 에러가 발생하였습니다. ${err}`,
      );
    }
  }

  async deleteBoardPhoto(board_no: number): Promise<number> {
    try {
      const { affected }: DeleteResult = await this.createQueryBuilder(
        'boardPhotos',
      )
        .delete()
        .from(BoardPhoto)
        .where('board_no = :board_no', { board_no })
        .execute();

      return affected;
    } catch (err) {
      throw new InternalServerErrorException(
        `게시글 사진 지우는 로직 에러 발생 ${err}`,
      );
    }
  }
}

@EntityRepository(ProfilePhoto)
export class ProfilePhotoRepository extends Repository<ProfilePhoto> {
  async saveProfilePhoto(photo_url: string, user: User): Promise<any> {
    try {
      const result: InsertResult = await this.createQueryBuilder(
        'profile_photos',
      )
        .insert()
        .into(ProfilePhoto)
        .values({ photo_url, user })
        .execute();
      return result.identifiers;
    } catch (err) {
      throw new InternalServerErrorException(
        `${err} 프로필 사진 추가 중 발생한 서버에러 입니다.`,
      );
    }
  }

  async deleteProfilePhoto(photoNo: number): Promise<void> {
    try {
      await this.createQueryBuilder('profile_photos')
        .delete()
        .where('no = :photoNo', { photoNo })
        .execute();
    } catch (err) {
      throw new InternalServerErrorException(
        `${err} 기존 프로필 사진 삭제 중 발생한 서버에러 입니다. `,
      );
    }
  }

  async readProfilePhoto(userNo: User): Promise<ProfilePhoto> {
    try {
      const profilePhoto: ProfilePhoto = await this.createQueryBuilder(
        'profile_photos',
      )
        .select(['profile_photos.no', 'profile_photos.photo_url'])
        .where('profile_photos.user_no = :userNo', { userNo })
        .getOne();

      return profilePhoto;
    } catch (err) {
      throw new InternalServerErrorException(
        `${err} 프로필 사진을 가져오는 도중 발생한 서버 에러입니다.`,
      );
    }
  }
}
