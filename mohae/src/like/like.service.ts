import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entity/user.entity';
import { UserRepository } from 'src/auth/repository/user.repository';
import { BoardRepository } from 'src/boards/repository/board.repository';
import { ErrorConfirm } from 'src/utils/error';
import { LikeUserDto, LikeBoardDto } from './dto/user-like.dto';
import {
  BoardLikeRepository,
  LikeRepository,
} from './repository/like.repository';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(LikeRepository)
    private likeRepository: LikeRepository,

    @InjectRepository(BoardLikeRepository)
    private boardLikeRepository: BoardLikeRepository,

    @InjectRepository(UserRepository)
    private userRepository: UserRepository,

    @InjectRepository(BoardRepository)
    private boardRepository: BoardRepository,

    private errorConfirm: ErrorConfirm,
  ) {}
  async likeUser(likeUserDto: LikeUserDto) {
    try {
      const { userNo, likedUserNo, judge }: LikeUserDto = likeUserDto;
      const user: User = await this.userRepository.findOne(userNo, {
        select: ['no'],
        relations: ['likedUser'],
      });
      const likedUser: User = await this.userRepository.findOne(likedUserNo, {
        select: ['no'],
        relations: ['likedMe'],
      });
      this.errorConfirm.notFoundError(
        user,
        ` ${userNo}번의 유저는 존재하지 않는 유저 입니다.`,
      );
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

  async likeBoard(likeBoardDto: LikeBoardDto) {
    try {
      const { userNo, boardNo, judge } = likeBoardDto;
      const board = await this.boardRepository.findOne(boardNo, {
        relations: ['likedUser'],
      });
      const user = await this.userRepository.findOne(userNo, {
        relations: ['likedBoard'],
      });
      this.errorConfirm.notFoundError(
        board,
        ` ${boardNo}번의 게시글은 존재하지 않는 게시글 입니다.`,
      );
      this.errorConfirm.notFoundError(
        user,
        `${userNo}번의 유저는 존재하지 않는 유저 입니다.`,
      );

      if (judge) {
        const countedLikeBoard = await this.boardLikeRepository.isBoardLike(
          board.no,
          user.no,
        );
        if (countedLikeBoard) {
          throw new ConflictException(
            '좋아요를 중복해서 요청할 수 없습니다 (좋아요 취소는 judge false로 넣어주세요)',
          );
        }
        const isLikeBoard = await this.boardLikeRepository.likeBoard(
          board,
          user,
        );

        if (!isLikeBoard) {
          throw new Error('게시글 좋아요 도중 일어난 알수 없는 오류 입니당');
        }
        return isLikeBoard;
      }
      const isLikeBoard = await this.boardLikeRepository.dislikeBoard(
        board.no,
        user.no,
      );

      if (!isLikeBoard) {
        throw new NotFoundException(
          '좋아요 취소를 중복해서 요청할 수 없습니다 (좋아요는 judge true로 넣어주세요)',
        );
      }
      return isLikeBoard;
    } catch (err) {
      throw err;
    }
  }
}
