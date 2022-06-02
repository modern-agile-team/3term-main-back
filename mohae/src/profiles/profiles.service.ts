import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/auth/entity/user.entity';

import { UserRepository } from 'src/auth/repository/user.repository';
import { Category } from 'src/categories/entity/category.entity';
import { CategoryRepository } from 'src/categories/repository/category.repository';
import { ErrorConfirm } from 'src/common/utils/error';
import { LikeRepository } from 'src/like/repository/like.repository';
import { Major } from 'src/majors/entity/major.entity';
import { MajorRepository } from 'src/majors/repository/major.repository';
import { ProfilePhotoRepository } from 'src/photo/repository/photo.repository';
import { School } from 'src/schools/entity/school.entity';
import { SchoolRepository } from 'src/schools/repository/school.repository';
import { JudgeDuplicateNicknameDto } from './dto/judge-duplicate-nickname.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Connection } from 'typeorm';
import { ProfilePhoto } from 'src/photo/entity/profile.photo.entity';

@Injectable()
export class ProfilesService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly schoolRepository: SchoolRepository,
    private readonly majorRepository: MajorRepository,
    private readonly categoriesRepository: CategoryRepository,
    private readonly likeRepository: LikeRepository,
    private readonly errorConfirm: ErrorConfirm,
    private readonly profilePhotoRepository: ProfilePhotoRepository,
    private readonly connection: Connection,
  ) {}

  async readUserProfile(
    profileUserNo: number,
    userNo: number,
  ): Promise<object> {
    try {
      const { profile, boardsCount }: any =
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
      profile['likedCount'] = likedUser.length;
      profile['boardsCount'] = Number(boardsCount);
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
    userNo: User,
    updateProfileDto: UpdateProfileDto,
    profilePhotoUrl: any,
  ): Promise<string> {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const profile: User = await this.userRepository.findOne(userNo, {
        relations: ['categories'],
      });

      const profileKeys: string[] = Object.keys(updateProfileDto);
      const deletedNullprofile: object = {};

      profileKeys.forEach((item) => {
        updateProfileDto[item]
          ? (deletedNullprofile[item] = updateProfileDto[item])
          : 0;
      });
      delete deletedNullprofile['categories'];

      const { school, major, categories }: UpdateProfileDto = updateProfileDto;

      const schoolNo = await this.schoolRepository.findOne(school);
      this.errorConfirm.notFoundError(
        schoolNo,
        `${schoolNo}에 해당 학교를 찾을 수 없습니다.`,
      );
      const majorNo = await this.majorRepository.findOne(major);
      this.errorConfirm.notFoundError(
        majorNo,
        `${majorNo}에 해당 전공을 찾을 수 없습니다.`,
      );

      const beforeProfile: ProfilePhoto =
        await this.profilePhotoRepository.readProfilePhoto(userNo);

      await queryRunner.manager
        .getCustomRepository(UserRepository)
        .updateProfile(userNo, deletedNullprofile);

      // 새로 들어온 profilePhoto가 존재하고, beforeProfile이 존재하면! > 기존 삭제 삭제하고, 새로운 사진 집어넣기
      if (profilePhotoUrl) {
        if (beforeProfile) {
          await queryRunner.manager
            .getCustomRepository(ProfilePhotoRepository)
            .deleteProfilePhoto(beforeProfile.no);
        }

        await queryRunner.manager
          .getCustomRepository(ProfilePhotoRepository)
          .saveProfilePhoto(profilePhotoUrl, userNo);
      }
      // null 인 경우에 categories.length 가 안먹혀서 이쉑끼가 어리버리 깜
      if (categories && categories.length) {
        const categoriesNo: Category[] =
          await this.categoriesRepository.selectCategory(categories);
        const filteredCategories: Category[] = categoriesNo.filter(
          (element) => element !== undefined,
        );

        for (const categoryNo of profile.categories) {
          await queryRunner.manager
            .getCustomRepository(CategoryRepository)
            .deleteUser(categoryNo, userNo);
        }
        for (const categoryNo of filteredCategories)
          await queryRunner.manager
            .getCustomRepository(CategoryRepository)
            .addUser(categoryNo.no, userNo);
      }
      await queryRunner.commitTransaction();
      return beforeProfile && profilePhotoUrl
        ? beforeProfile.photo_url
        : undefined;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
