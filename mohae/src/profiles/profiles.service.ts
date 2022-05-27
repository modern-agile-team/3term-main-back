import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entity/user.entity';

import { UserRepository } from 'src/auth/repository/user.repository';
import { Category } from 'src/categories/entity/category.entity';
import { CategoryRepository } from 'src/categories/repository/category.repository';
import { LikeRepository } from 'src/like/repository/like.repository';
import { Major } from 'src/majors/entity/major.entity';
import { MajorRepository } from 'src/majors/repository/major.repository';
import { School } from 'src/schools/entity/school.entity';
import { SchoolRepository } from 'src/schools/repository/school.repository';
import { ErrorConfirm } from 'src/common/utils/error';
import {
  JudgeDuplicateNicknameDto,
  UpdateProfileDto,
} from './dto/update-profile.dto';
import { create } from 'domain';
import { SpecRepository } from 'src/specs/repository/spec.repository';
import { BoardRepository } from 'src/boards/repository/board.repository';
import { Spec } from 'src/specs/entity/spec.entity';
import { Board } from 'src/boards/entity/board.entity';
import { ReviewRepository } from 'src/reviews/repository/review.repository';
import { Review } from 'src/reviews/entity/review.entity';

@Injectable()
export class ProfilesService {
  constructor(
    private userRepository: UserRepository,
    private schoolRepository: SchoolRepository,
    private majorRepository: MajorRepository,
    private categoriesRepository: CategoryRepository,
    private likeRepository: LikeRepository,
    private specRepository: SpecRepository,
    private boardRepository: BoardRepository,
    private reviewRepository: ReviewRepository,
    private errorConfirm: ErrorConfirm,
  ) {}

  async readUserProfile(
    profileUserNo: number,
    userNo: number,
  ): Promise<object> {
    try {
      const { profile, boardsNum }: any =
        await this.userRepository.readUserProfile(profileUserNo);
      if (!profile) {
        throw new NotFoundException(
          `No: ${profileUserNo} 일치하는 유저가 없습니다.`,
        );
      }
      const liked: number = await this.likeRepository.isLike(
        profileUserNo,
        userNo,
      );
      const islike: boolean = liked ? true : false;

      const { likedUser, createdAt }: any = profile;
      const userCreatedAt = `${createdAt.getFullYear()}.${
        createdAt.getMonth() + 1
      }.${createdAt.getDate()}`;

      delete profile.likedUser;
      delete profile.createdAt;

      profile['userCreatedAt'] = `${userCreatedAt}`;
      profile['likedNum'] = likedUser.length;
      profile['boardsNum'] = Number(boardsNum);
      profile['islike'] = islike;

      return {
        profile,
      };
    } catch (err) {
      throw err;
    }
  }

  async judgeDuplicateNickname(
    judgeDuplicateNicknameDto: JudgeDuplicateNicknameDto,
  ) {
    try {
      const { no, nickname }: JudgeDuplicateNicknameDto =
        judgeDuplicateNicknameDto;
      if (no) {
        const user: User = await this.userRepository.findOne(no, {
          select: ['no', 'nickname'],
        });

        if (user.nickname === nickname) {
          throw new ConflictException('현재 닉네임입니다.');
        }
      }
      const duplicateNickname: User = await this.userRepository.duplicateCheck(
        'nickname',
        nickname,
      );

      if (duplicateNickname) {
        throw new ConflictException('이미 사용 중인 닉네임 입니다.');
      }
    } catch (err) {
      throw err;
    }
  }

  async updateProfile(
    no: number,
    updateProfileDto: UpdateProfileDto,
  ): Promise<number> {
    try {
      const profile: User = await this.userRepository.findOne(no, {
        relations: ['categories'],
      });

      if (!profile) {
        throw new NotFoundException('유저 정보를 찾지 못했습니다.');
      }

      const profileKeys: Array<string> = Object.keys(updateProfileDto);
      const deletedNullprofile: object = {};

      profileKeys.forEach((item) => {
        updateProfileDto[item]
          ? (deletedNullprofile[item] = updateProfileDto[item])
          : 0;
      });
      const { school, major, categories }: UpdateProfileDto = updateProfileDto;

      for (const key of Object.keys(deletedNullprofile)) {
        switch (key) {
          case 'phone':
          case 'photo_url':
          case 'nickname':
            profile[key] = updateProfileDto[key];
            break;
          case 'school':
            const schoolRepo: School = await this.schoolRepository.findOne(
              school,
            );

            profile.school = schoolRepo;
            break;
          case 'major':
            const majorRepo: Major = await this.majorRepository.findOne(major);

            profile.major = majorRepo;
            break;
          case 'categories':
            const categoriesRepo: Array<Category> =
              await this.categoriesRepository.selectCategory(categories);
            const filteredCategories = categoriesRepo.filter(
              (element) => element !== undefined,
            );

            profile.categories.splice(0);
            profile.categories = filteredCategories;
            break;
        }
      }
      // 유령데이터 다시한번 생기면 save 의심해보기
      await this.userRepository.save(profile);
      return profile.no;
    } catch (err) {
      throw err;
    }
  }
}
