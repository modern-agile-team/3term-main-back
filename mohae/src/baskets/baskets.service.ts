import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entity/user.entity';
import { UserRepository } from 'src/auth/repository/user.repository';
import { Board } from 'src/boards/entity/board.entity';
import { BoardRepository } from 'src/boards/repository/board.repository';
import { ErrorConfirm } from 'src/common/utils/error';
import { BasketDto } from './dto/basket.dto';
import { BasketRepository } from './repository/baskets.repository';

@Injectable()
export class BasketsService {
  constructor(
    @InjectRepository(BasketRepository)
    private basketRepository: BasketRepository,

    @InjectRepository(UserRepository)
    private userRepository: UserRepository,

    @InjectRepository(BoardRepository)
    private boardRepository: BoardRepository,

    private errorConfirm: ErrorConfirm,
  ) {}

  async checkConfirm(basketDto: BasketDto): Promise<object> {
    const { check } = basketDto;
    if (!check) {
      const countedCheckBasket: number =
        await this.basketRepository.isCheckBasket(basketDto);

      if (!countedCheckBasket) {
        return { isSuccess: true };
      }

      return { isSuccess: false, msg: '찜한 게시글 입니다' };
    }

    const countedCheckBasket: number =
      await this.basketRepository.isCheckBasket(basketDto);

    if (countedCheckBasket) {
      return { isSuccess: true };
    }

    return { isSuccess: false, msg: '찜하지 않은 게시글 입니다' };
  }

  async checkBasket(basketDto: BasketDto): Promise<object> {
    try {
      const { userNo, boardNo, check }: BasketDto = basketDto;

      const user: User = await this.userRepository.findOne(userNo, {
        relations: ['baskets'],
      });
      this.errorConfirm.notFoundError(user, `해당 회원을 찾을 수 없습니다.`);

      const board: Board = await this.boardRepository.findOne(boardNo, {
        relations: ['baskets'],
      });
      this.errorConfirm.notFoundError(board, `해당 게시글을 찾을 수 없습니다.`);

      if (check) {
        const confirm: object = await this.checkConfirm(basketDto);
        if (!confirm['isSuccess']) {
          return confirm;
        }

        const canceledBasket: number = await this.basketRepository.cancelBasket(
          basketDto,
        );

        if (!canceledBasket) {
          throw new BadRequestException('찜한 게시글 삭제중 에러 발생');
        }

        return {
          isSuccess: true,
          msg: '게시글 찜하기 취소 요청이 성공하였습니다.',
        };
      }
      const confirm: object = await this.checkConfirm(basketDto);

      if (!confirm['isSuccess']) {
        return confirm;
      }

      const checkedBasket: number = await this.basketRepository.checkBasket(
        user,
        board,
      );

      if (!checkedBasket) {
        throw new BadRequestException('찜하기 저장중 에러 발생');
      }

      return { isSuccess: true, msg: '게시글 찜하기 요청이 성공하였습니다.' };
    } catch (err) {
      throw err;
    }
  }
}
