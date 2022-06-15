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
import { array, boolean } from 'joi';

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
      const profile: any = await this.userRepository.readUserProfile(
        profileUserNo,
        userNo,
      );

      profile.categories = profile.categoryNo
        .split('|')
        .map((categoriesInfo: string) => {
          const categoryInfo: string[] = categoriesInfo.split(',');
          return {
            no: categoryInfo[0],
            name: categoryInfo[1],
          };
        });

      profile.isLike = !!Number(profile.isLike);
      delete profile.categoryNo;

      if (!profile) {
        throw new NotFoundException(
          `No: ${profileUserNo}에 해당하는 회원을 찾을 수 없습니다.`,
        );
      }

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
      const schoolNo: School = await this.schoolRepository.findOne(school);

      this.errorConfirm.notFoundError(
        schoolNo,
        `${school}에 해당하는 학교를 찾을 수 없습니다.`,
      );

      const majorNo: Major = await this.majorRepository.findOne(major);

      this.errorConfirm.notFoundError(
        majorNo,
        `${major}에 해당하는 전공을 찾을 수 없습니다.`,
      );

      await queryRunner.manager
        .getCustomRepository(UserRepository)
        .updateProfile(userNo, deletedNullprofile);

      const beforeProfile: ProfilePhoto =
        await this.profilePhotoRepository.readProfilePhoto(userNo);

      if (profilePhotoUrl) {
        if (beforeProfile) {
          await queryRunner.manager
            .getCustomRepository(ProfilePhotoRepository)
            .deleteProfilePhoto(beforeProfile.no);
        }
        if (profilePhotoUrl !== 'default.jpg')
          await queryRunner.manager
            .getCustomRepository(ProfilePhotoRepository)
            .saveProfilePhoto(profilePhotoUrl, userNo);
      }
      if (categories && categories.length) {
        const categoriesNo: Category[] =
          await this.categoriesRepository.selectCategory(categories);
        const filteredCategories: Category[] = categoriesNo.filter(
          (category: Category) => category !== undefined,
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
