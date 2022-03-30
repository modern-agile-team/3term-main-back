import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entity/user.entity';
import { UserRepository } from 'src/auth/repository/user.repository';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  // 프로필 수정이랑 프로필 조회 기능이 Repository가 UserRepository라 ProfileService에 둘 지 UserRepository에 따로 뺄지 정해야함
  async findOneProfile(no: number): Promise<object> {
    const profile = await this.userRepository.findOneUser(no);

    if (!profile) {
      throw new NotFoundException(`No: ${no} 일치하는 유저가 없습니다.`);
    }

    const { name, email, nickname, createdAt, photo_url, school } = profile;

    return { no, name, email, nickname, photo_url, school, createdAt };
  }

  async updateProfile(
    no: number,
    updateProfileDto: UpdateProfileDto,
  ): Promise<number> {
    const profile = await this.userRepository.findOne(no);

    if (!profile) {
      throw new NotFoundException('유저 정보를 찾지 못했습니다.');
    }

    const { phone, nickname, major, photo_url } = updateProfileDto;

    profile.phone = phone;
    profile.nickname = nickname;
    profile.photo_url = photo_url;

    await this.userRepository.save(profile);

    return profile.no;
  }
}
