import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/repository/user.repository';
import { ErrorConfirm } from 'src/utils/error';
import { LikeUserDto } from './dto/user-like.dto';
import { LikeRepository } from './repository/like.repository';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(LikeRepository)
    private likeRepository: LikeRepository,

    @InjectRepository(UserRepository)
    private userRepository: UserRepository,

    private errorConfirm: ErrorConfirm,
  ) {}
  async likeUser(likeUserDto: LikeUserDto) {
    try {
      const { userNo, likedUserNo, judge } = likeUserDto;
      const user = await this.userRepository.findOne(userNo, {
        relations: ['likedUser'],
      });
      const likedUser = await this.userRepository.findOne(likedUserNo, {
        relations: ['likedMe'],
      });
      this.errorConfirm.notFoundError(user, '존재하지 않는 유저 입니다.');
      this.errorConfirm.notFoundError(likedUser, '존재하지 않는 유저 입니다.');

      if (judge) {
        const countedLikeUser = await this.likeRepository.isLike(
          user.no,
          likedUser.no,
        );
        if (countedLikeUser.length >= 1) {
          throw new ConflictException(
            '좋아요를 중복해서 요청할 수 없습니다 (좋아요 취소는 judge false로 넣어주세요)',
          );
        }
        const isLikeUser = await this.likeRepository.likeUser(user, likedUser);
        return isLikeUser;
      }
      const isLikeUser = await this.likeRepository.dislikeUser(user, likedUser);
      return isLikeUser;
    } catch (err) {
      throw err;
    }
  }
}
