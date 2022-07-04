import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entity/user.entity';
import { UserRepository } from 'src/auth/repository/user.repository';
import { Board } from 'src/boards/entity/board.entity';
import { BoardRepository } from 'src/boards/repository/board.repository';
import { ErrorConfirm } from 'src/common/utils/error';
import { Connection } from 'typeorm';
import { LikeBoardDto } from './dto/board-like.dto';
import { LikeUserDto } from './dto/user-like.dto';
import {
  BoardLikeRepository,
  LikeRepository,
} from './repository/like.repository';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(LikeRepository)
    private readonly likeRepository: LikeRepository,

    @InjectRepository(BoardLikeRepository)
    private readonly boardLikeRepository: BoardLikeRepository,

    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,

    @InjectRepository(BoardRepository)
    private readonly boardRepository: BoardRepository,

    private readonly connection: Connection,

    private readonly errorConfirm: ErrorConfirm,
  ) {}
  async likeUser(user: User, likeUserDto: LikeUserDto) {
    try {
      const { likedUserNo, judge }: LikeUserDto = likeUserDto;

      const likedUser: User = await this.userRepository.findOne(likedUserNo, {
        select: ['no'],
        relations: ['likedMe'],
      });

      this.errorConfirm.notFoundError(
        likedUser,
        `${likedUserNo}번의 유저는 존재하지 않는 유저 입니다.`,
      );

      if (judge) {
        const countedLikeUser: number = await this.likeRepository.isLike(
          likedUser.no,
          user.no,
        );
        if (countedLikeUser) {
          throw new ConflictException(
            '좋아요를 중복해서 요청할 수 없습니다 (좋아요 취소는 judge false로 넣어주세요)',
          );
        }
        const isLikeUser: number = await this.likeRepository.likeUser(
          user,
          likedUser,
        );

        if (!isLikeUser) {
          throw new InternalServerErrorException(
            '유저 좋아요도중 일어난 알수 없는 오류 입니다.',
          );
        }
        return isLikeUser;
      }
      const isLikeUser: number = await this.likeRepository.dislikeUser(
        user.no,
        likedUser.no,
      );

      if (!isLikeUser) {
        throw new NotFoundException(
          '좋아요 취소를 중복해서 요청할 수 없습니다 (좋아요는 judge true로 넣어주세요)',
        );
      }
      return isLikeUser;
    } catch (err) {
      throw err;
    }
  }

  async likeBoard(userNo: number, boardNo: number, likeBoardDto: LikeBoardDto) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { judge }: LikeBoardDto = likeBoardDto;
      const board: Board = await this.boardRepository.findOne(boardNo, {
        relations: ['likedUser'],
      });

      this.errorConfirm.notFoundError(
        board,
        ` ${boardNo}번의 게시글은 존재하지 않는 게시글 입니다.`,
      );

      const user: User = await this.userRepository.findOne(userNo, {
        relations: ['likedBoard'],
      });

      this.errorConfirm.notFoundError(
        user,
        `${userNo}번의 유저는 존재하지 않는 유저 입니다.`,
      );

      if (judge) {
        const countedLikeBoard: number =
          await this.boardLikeRepository.isBoardLike(board.no, user.no);
        if (countedLikeBoard) {
          throw new ConflictException(
            '좋아요를 중복해서 요청할 수 없습니다 (좋아요 취소는 judge false로 넣어주세요)',
          );
        }
        const isLikeBoard: number = await queryRunner.manager
          .getCustomRepository(BoardLikeRepository)
          .likeBoard(board, user);

        if (!isLikeBoard) {
          throw new Error('게시글 좋아요 도중 일어난 알수 없는 오류 입니다.');
        }
      } else {
        const isLikeBoard: number = await queryRunner.manager
          .getCustomRepository(BoardLikeRepository)
          .dislikeBoard(board.no, user.no);

        if (!isLikeBoard) {
          throw new ConflictException(
            '좋아요 취소를 중복해서 요청할 수 없습니다 (좋아요는 judge true로 넣어주세요)',
          );
        }
      }
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
