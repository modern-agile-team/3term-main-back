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
    private readonly basketRepository: BasketRepository,

    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,

    @InjectRepository(BoardRepository)
    private readonly boardRepository: BoardRepository,

    private readonly errorConfirm: ErrorConfirm,
  ) {}

  async checkConfirm(basketDto: BasketDto): Promise<object> {
    try {
      const { userNo, boardNo }: BasketDto = basketDto;

      const user: User = await this.userRepository.findOne(userNo, {
        relations: ['baskets'],
      });
      this.errorConfirm.notFoundError(user, `해당 회원을 찾을 수 없습니다.`);

      const board: Board = await this.boardRepository.findOne(boardNo, {
        relations: ['baskets'],
      });
      this.errorConfirm.notFoundError(board, `해당 게시글을 찾을 수 없습니다.`);

      const isCheckedConfirm: number =
        await this.basketRepository.isCheckBasket(basketDto);

      if (!isCheckedConfirm) {
        return await this.checkBasket(user, board);
      }

      return await this.deleteBasket(basketDto);
    } catch (err) {
      throw err;
    }
  }

  async checkBasket(user: User, board: Board): Promise<object> {
    try {
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

  async deleteBasket(basketDto: BasketDto) {
    try {
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
    } catch (err) {
      throw err;
    }
  }
}
