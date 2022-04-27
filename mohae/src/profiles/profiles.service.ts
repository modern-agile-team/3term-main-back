import {
  ConflictException,
  ConsoleLogger,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isLocale } from 'class-validator';
import { User } from 'src/auth/entity/user.entity';
import { UserRepository } from 'src/auth/repository/user.repository';
import { CategoryRepository } from 'src/categories/repository/category.repository';
import { LikeRepository } from 'src/like/repository/like.repository';
import { MajorRepository } from 'src/majors/repository/major.repository';
import { SchoolRepository } from 'src/schools/repository/school.repository';
import { ErrorConfirm } from 'src/utils/error';
import {
  JudgeDuplicateNicknameDto,
  UpdateProfileDto,
} from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,

    @InjectRepository(SchoolRepository)
    private schoolRepository: SchoolRepository,

    @InjectRepository(MajorRepository)
    private majorRepository: MajorRepository,

    @InjectRepository(CategoryRepository)
    private categoriesRepository: CategoryRepository,

    @InjectRepository(LikeRepository)
    private likeRepository: LikeRepository,

    private errorConfirm: ErrorConfirm,
  ) {}

  // 프로필 수정이랑 프로필 조회 기능이 Repository가 UserRepository라 ProfileService에 둘 지 UserRepository에 따로 뺄지 정해야함
  async findOneProfile(profileUserNo, userNo): Promise<object> {
    try {
      const profile = await this.userRepository.findOneUser(profileUserNo);
      if (!profile) {
        throw new NotFoundException(
          `No: ${profileUserNo} 일치하는 유저가 없습니다.`,
        );
      }
      const isliked = await this.likeRepository.isLike(profileUserNo, userNo);
      let islike = false;
      if (isliked === 1) {
        islike = true;
      }

      const {
        likedMe,
        name,
        email,
        nickname,
        createdAt,
        photo_url,
        school,
        major,
        specs,
        categories,
        boards,
      } = profile;
      const likedNum = likedMe.length;

      return {
        profileUserNo,
        name,
        email,
        nickname,
        photo_url,
        createdAt,
        likedNum,
        islike,
        boards,
        school,
        major,
        specs,
        categories,
      };
    } catch (err) {
      throw err;
    }
  }

  async judgeDuplicateNickname(
    judgeDuplicateNicknameDto: JudgeDuplicateNicknameDto,
  ) {
    try {
      const { no, nickname } = judgeDuplicateNicknameDto;

      const user = await this.userRepository.findOne(no);
      if (user.nickname === nickname) {
        throw new ConflictException('현재 닉네임입니다.');
      }
      const duplicateNickname = await this.userRepository.duplicateCheck(
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
      const profile = await this.userRepository.findOne(no, {
        relations: ['categories'],
      });
      if (!profile) {
        throw new NotFoundException('유저 정보를 찾지 못했습니다.');
      }

      const profileKeys = Object.keys(updateProfileDto);
      const deletedNullprofile = {};
      profileKeys.forEach((item) => {
        updateProfileDto[item]
          ? (deletedNullprofile[item] = updateProfileDto[item])
          : 0;
      });

      const { nickname, school, major, categories } = updateProfileDto;

      for (const key of Object.keys(deletedNullprofile)) {
        switch (key) {
          case 'phone':
          case 'photo_url':
            profile[key] = updateProfileDto[key];
            break;
          case 'school':
            const schoolRepo = await this.schoolRepository.findOne(school);
            profile.school = schoolRepo;
            break;
          case 'major':
            const majorRepo = await this.majorRepository.findOne(major);
            profile.major = majorRepo;
            break;
          case 'nickname':
            const duplicateNickname = await this.userRepository.duplicateCheck(
              'nickname',
              nickname,
            );
            if (duplicateNickname) {
              throw new ConflictException('이미 존재하는 닉네임입니다.');
            }
            profile.nickname = nickname;
            break;
          case 'categories':
            const categoriesRepo =
              await this.categoriesRepository.selectCategory(categories);
            const filteredCategories = categoriesRepo.filter(
              (element) => element !== undefined,
            );
            profile.categories.splice(0);
            profile.categories = filteredCategories;
            break;
        }
      }
      await this.userRepository.save(profile);

      return profile.no;
    } catch (err) {
      throw err;
    }
  }
}
