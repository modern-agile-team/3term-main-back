import { InternalServerErrorException } from '@nestjs/common';
import { User } from 'src/auth/entity/user.entity';
import { Board } from 'src/boards/entity/board.entity';
import { EntityRepository, InsertResult, Repository } from 'typeorm';
import { BasketDto } from '../dto/busket.dto';
import { Basket } from '../entity/baskets.entity';

@EntityRepository(Basket)
export class BasketRepository extends Repository<Basket> {
  async checkBasket(userNo: User, boardNo: Board): Promise<number> {
    try {
      const { raw }: InsertResult = await this.createQueryBuilder()
        .insert()
        .into(Basket)
        .values({ userNo, boardNo })
        .execute();

      return raw.affectedRows;
    } catch (err) {
      throw new InternalServerErrorException(
        `${err} ### 게시글 찜하기: 알 수 없는 서버 에러입니다.`,
      );
    }
  }

  async isCheckBasket(userNo: number, boardNo: number): Promise<number> {
    try {
      const numberOfChecks: Array<object> = await this.createQueryBuilder(
        'baskets',
      )
        .where('user_no = :userNo', { userNo })
        .andWhere('board_no = :boardNo', { boardNo })
        .execute();

      return numberOfChecks.length;
    } catch (err) {
      throw new InternalServerErrorException(
        `${err} ### 게시글 찜하기 확인: 알 수 없는 서버 에러입니다.`,
      );
    }
  }

  async cancelBasket(userNo: number, boardNo: number) {
    try {
      const { affected } = await this.createQueryBuilder('baskets')
        .delete()
        .where('user_no = :userNo', { userNo })
        .andWhere('board_no = :boardNo', { boardNo })
        .execute();

      return affected;
    } catch (err) {
      throw new InternalServerErrorException(
        `${err} ### 게시글 찜하기 취소: 알 수 없는 서버 에러입니다.`,
      );
    }
  }
}
