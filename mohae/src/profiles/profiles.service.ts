import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/auth/entity/user.entity';
import { Category } from 'src/categories/entity/category.entity';
import { ProfilePhoto } from 'src/photo/entity/profile.photo.entity';
import { UserRepository } from 'src/auth/repository/user.repository';
import { CategoryRepository } from 'src/categories/repository/category.repository';
import { LikeRepository } from 'src/like/repository/like.repository';
import { MajorRepository } from 'src/majors/repository/major.repository';
import { ProfilePhotoRepository } from 'src/photo/repository/photo.repository';
import { SchoolRepository } from 'src/schools/repository/school.repository';
import { JudgeDuplicateNicknameDto } from './dto/judge-duplicate-nickname.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ErrorConfirm } from 'src/common/utils/error';
import { Connection } from 'typeorm';

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
      if (!profile) {
        throw new NotFoundException(
          `No: ${profileUserNo}에 해당하는 회원을 찾을 수 없습니다.`,
        );
      }
      if (profile.categoryNo.length) {
        profile.categories = profile.categoryNo
          .split('|')
          .map((categoriesInfo: string) => {
            const categoryInfo: string[] = categoriesInfo.split(',');
            return {
              no: categoryInfo[0],
              name: categoryInfo[1],
            };
          });
      } else {
        profile.categories = [];
      }
      delete profile.categoryNo;
      profile.isLike = !!Number(profile.isLike);

      return profile;
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

      const { categories }: UpdateProfileDto = updateProfileDto;
      delete updateProfileDto.categories;

      await queryRunner.manager
        .getCustomRepository(UserRepository)
        .updateProfile(userNo, updateProfileDto);

      const beforeProfile: ProfilePhoto =
        await this.profilePhotoRepository.readProfilePhoto(userNo);

      if (profilePhotoUrl) {
        if (beforeProfile) {
          await queryRunner.manager
            .getCustomRepository(ProfilePhotoRepository)
            .deleteProfilePhoto(beforeProfile.no);
        }
        if (profilePhotoUrl !== 'logo.jpg')
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
