import { InternalServerErrorException } from '@nestjs/common';
import { CreateBoardDto } from 'src/boards/dto/board.dto';
import { Board } from 'src/boards/entity/board.entity';
import { Spec } from 'src/specs/entity/spec.entity';
import {
  EntityRepository,
  InsertResult,
  Repository,
  UpdateResult,
} from 'typeorm';
import { BoardPhoto } from '../entity/board.photo.entity';
import { SpecPhoto } from '../entity/photo.entity';

@EntityRepository(SpecPhoto)
export class SpecPhotoRepository extends Repository<SpecPhoto> {
  async saveSpecPhoto(photoArr: Array<object>): Promise<Array<object>> {
    try {
      const result: InsertResult = await this.createQueryBuilder('specPhoto')
        .insert()
        .into(SpecPhoto)
        .values(photoArr)
        .execute();

      return result.identifiers;
    } catch (err) {
      throw new InternalServerErrorException(
        `스펙 사진 저장도중 에러가 발생 하였습니다.${err}`,
      );
    }
  }

  async deleteBeforePhoto(specPhotos: Array<SpecPhoto>): Promise<void> {
    try {
      await this.createQueryBuilder('specPhoto')
        .delete()
        .from(SpecPhoto)
        .where(specPhotos)
        .execute();
    } catch (err) {
      throw err;
    }
  }

  async getSpecNo(no: number): Promise<number> {
    try {
      const { spec }: any = await this.createQueryBuilder('specPhoto')
        .leftJoinAndSelect('specPhoto.spec', 'spec')
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
  async createPhoto(photo_url, board_no): Promise<number> {
    try {
      const { raw } = await this.createQueryBuilder('boardPhotos')
        .insert()
        .into(BoardPhoto)
        .values([{ photo_url, board: board_no }])
        .execute();

      return raw.insertId;
    } catch (err) {
      throw new InternalServerErrorException(
        `게시글 사진 저장도중 에러가 발생하였습니다. ${err}`,
      );
    }
  }

  async updatePhoto(no: number, new_url: string): Promise<number> {
    try {
      const { affected }: UpdateResult = await this.createQueryBuilder(
        'specPhoto',
      )
        .update(BoardPhoto)
        .set({ photo_url: new_url })
        .where('no = :no', { no })
        .execute();

      if (!affected) {
        throw new InternalServerErrorException(
          '스펙 사진 업데이트 중 오류가 발생 하였습니다.(아마 specPhoto no 문제일 가능성 매우높음)',
        );
      }

      return affected;
    } catch (err) {
      throw err;
    }
  }

  async getSpecNo(no: number): Promise<number> {
    try {
      const { spec }: any = await this.createQueryBuilder('boardPhotos')
        .leftJoinAndSelect('boardPhotos.spec', 'spec')
        .select(['boardPhotos.no', 'spec.no'])
        .where('boardPhoto.no = :no', { no })
        .getOne();

      return spec.no;
    } catch (err) {
      throw new InternalServerErrorException(
        `스펙 번호 가져오기 도중 오류가 발생 하였습니다.${err}`,
      );
    }
  }
}
