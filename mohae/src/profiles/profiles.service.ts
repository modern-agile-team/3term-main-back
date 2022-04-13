import { ConsoleLogger, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entity/user.entity';
import { UserRepository } from 'src/auth/repository/user.repository';
import { CategoryRepository } from 'src/categories/repository/category.repository';
import { MajorRepository } from 'src/majors/repository/major.repository';
import { SchoolRepository } from 'src/schools/repository/school.repository';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private schoolRepository: SchoolRepository,
    private majorRepository: MajorRepository,
    private categoriesRepository: CategoryRepository,
  ) {}

  // 프로필 수정이랑 프로필 조회 기능이 Repository가 UserRepository라 ProfileService에 둘 지 UserRepository에 따로 뺄지 정해야함
  async findOneProfile(no: number): Promise<object> {
    const profile = await this.userRepository.findOneUser(no);
    if (!profile) {
      throw new NotFoundException(`No: ${no} 일치하는 유저가 없습니다.`);
    }

    const {
      name,
      email,
      nickname,
      createdAt,
      photo_url,
      school,
      major,
      specs,
      categories,
    } = profile;

    return {
      no,
      name,
      email,
      nickname,
      photo_url,
      createdAt,
      school,
      major,
      specs,
      categories,
    };
  }

  async updateProfile(
    no: number,
    updateProfileDto: UpdateProfileDto,
  ): Promise<number> {
    const profile = await this.userRepository.findOne(no);
    console.log(profile);
    if (!profile) {
      throw new NotFoundException('유저 정보를 찾지 못했습니다.');
    }

    const { phone, nickname, school, major, categories, photo_url } =
      updateProfileDto;

    const schoolRepo = await this.schoolRepository.findOne(school, {
      relations: ['users'],
    });
    const majorRepo = await this.majorRepository.findOne(major, {
      relations: ['users'],
    });

    profile.phone = phone;
    profile.nickname = nickname;
    profile.photo_url = photo_url;
    profile.major = majorRepo;
    profile.school = schoolRepo;

    await this.userRepository.save(profile);

    console.log(profile);

    return profile.no;
  }
}
