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
import { BasketDto } from './dto/busket.dto';
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

  async checkBasket(basketDto: BasketDto): Promise<boolean> {
    try {
      const { userNo, boardNo, judge }: BasketDto = basketDto;
      const user: User = await this.userRepository.findOne(userNo, {
        relations: ['baskets'],
      });

      this.errorConfirm.notFoundError(user, `해당 회원을 찾을 수 없습니다.`);

      const board: Board = await this.boardRepository.findOne(boardNo, {
        relations: ['baskets'],
      });

      this.errorConfirm.notFoundError(board, `해당 게시글을 찾을 수 없습니다.`);

      if (judge) {
        const countedCheckBasket: number =
          await this.basketRepository.isCheckBasket(userNo, boardNo);

        if (countedCheckBasket) {
          throw new BadRequestException('이미 찜한 게시글 입니다.');
        }

        const checkedBasket: number = await this.basketRepository.checkBasket(
          user,
          board,
        );
        if (!checkedBasket) {
          throw new BadRequestException('찜하기 저장중 에러 발생');
        }
      } else {
        const countedCheckBasket: number =
          await this.basketRepository.isCheckBasket(userNo, boardNo);

        if (!countedCheckBasket) {
          throw new BadRequestException('찜한 게시글이 아닙니다.');
        }

        const canceledBasket: number = await this.basketRepository.cancelBasket(
          userNo,
          boardNo,
        );
        if (!canceledBasket) {
          throw new BadRequestException('찜하기 저장중 에러 발생');
        }
      }
      return true;
    } catch (err) {
      throw err;
    }
  }
}
