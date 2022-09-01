import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/auth/entity/user.entity';
import { Category } from 'src/categories/entity/category.entity';
import { ProfilePhoto } from 'src/photo/entity/profile.photo.entity';
import { UserRepository } from 'src/auth/repository/user.repository';
import { CategoryRepository } from 'src/categories/repository/category.repository';
import { ProfilePhotoRepository } from 'src/photo/repository/photo.repository';
import { JudgeDuplicateNicknameDto } from './dto/judge-duplicate-nickname.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Connection, QueryRunner } from 'typeorm';
import { AwsService } from 'src/aws/aws.service';
import { SchoolRepository } from 'src/schools/repository/school.repository';
import { MajorRepository } from 'src/majors/repository/major.repository';
import { School } from 'src/schools/entity/school.entity';
import { Major } from 'src/majors/entity/major.entity';

export interface Profile {
  userNo: number | null;
  email: string | null;
  nickname: string | null;
  phone: string | null;
  manager: boolean;
  createdAt: string | null;
  name: string | null;
  photo_url: string | null;
  boardNum: string;
  likedUserNum: string;
  isLike: boolean;
  schoolNo: number | null;
  schoolName: string | null;
  majorNo: number | null;
  majorName: string | null;
  categoryNo?: string | null;
  categories?: object[];
}

@Injectable()
export class ProfilesService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly categoriesRepository: CategoryRepository,
    private readonly profilePhotoRepository: ProfilePhotoRepository,
    private schoolRepository: SchoolRepository,
    private majorRepository: MajorRepository,
    private readonly connection: Connection,
    private readonly awsService: AwsService,
  ) {}

  async readUserProfile(
    profileUserNo: number,
    userNo: number,
  ): Promise<Profile> {
    try {
      const profile: Profile = await this.userRepository.readUserProfile(
        profileUserNo,
        userNo,
      );
      if (!profile.userNo) {
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

        if (user?.nickname === nickname) {
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
    file: Express.Multer.File,
  ): Promise<void> {
    const queryRunner: QueryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const profilePhotoUrl: false | string = !file
        ? false
        : await this.awsService.uploadProfileFileToS3('profile', file);

      const profile: User = await this.userRepository.findOne(userNo, {
        relations: ['categories'],
      });

      const { categories, school, major }: UpdateProfileDto = updateProfileDto;
      delete updateProfileDto.categories;

      await this.changeSchoolAndMajorVerified(updateProfileDto, school, major);

      await queryRunner.manager
        .getCustomRepository(UserRepository)
        .updateProfile(userNo, updateProfileDto);

      const beforeProfilePhotoUrl: ProfilePhoto =
        await this.profilePhotoRepository.readProfilePhoto(userNo);

      await this.changeProfilePhoto(
        userNo,
        profilePhotoUrl,
        beforeProfilePhotoUrl,
        queryRunner,
      );
      await this.changeProfileCategories(
        userNo,
        profile,
        categories,
        queryRunner,
      );
      if (beforeProfilePhotoUrl && profilePhotoUrl) {
        await this.awsService.deleteProfileS3Object(
          beforeProfilePhotoUrl.photo_url,
        );
      }
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async changeSchoolAndMajorVerified(
    updateProfileDto: UpdateProfileDto,
    school: School,
    major: Major,
  ) {
    updateProfileDto.school = school
      ? await this.schoolRepository.findOne(school, {
          select: ['no'],
        })
      : null;
    if (updateProfileDto.school === undefined) {
      throw new BadRequestException(
        `${school}에 해당하는 학교는 존재하지 않습니다.`,
      );
    }

    updateProfileDto.major = major
      ? await this.majorRepository.findOne(major, {
          select: ['no'],
        })
      : null;

    if (updateProfileDto.major === undefined) {
      throw new BadRequestException(
        `${major}에 해당하는 전공은 존재하지 않습니다.`,
      );
    }
  }

  async changeProfilePhoto(
    userNo: User,
    profilePhotoUrl: false | string,
    beforeProfile: ProfilePhoto,
    queryRunner: QueryRunner,
  ) {
    if (profilePhotoUrl) {
      if (beforeProfile) {
        await queryRunner.manager
          .getCustomRepository(ProfilePhotoRepository)
          .deleteProfilePhoto(beforeProfile.no);
      }
      if (profilePhotoUrl !== 'logo.png')
        await queryRunner.manager
          .getCustomRepository(ProfilePhotoRepository)
          .saveProfilePhoto(profilePhotoUrl, userNo);
    }
  }

  async changeProfileCategories(
    userNo: User,
    profile: User,
    categories: [],
    queryRunner: QueryRunner,
  ) {
    const categoriesNo: Category[] =
      await this.categoriesRepository.selectCategory(categories);
    const afterCategories: number[] = categoriesNo.map((category) => {
      return category.no;
    });
    const beforeCategories: number[] = profile.categories.map((category) => {
      return category.no;
    });

    if (beforeCategories.length) {
      await queryRunner.manager
        .getCustomRepository(CategoryRepository)
        .deleteUser(beforeCategories, userNo);
    }
    await queryRunner.manager
      .getCustomRepository(CategoryRepository)
      .addUser(afterCategories, userNo);
  }
}
