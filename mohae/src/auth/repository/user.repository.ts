import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from '../dto/auth-credential.dto';
import { User } from '../entity/user.entity';
import * as bcrypt from 'bcryptjs';
import { Duplex } from 'stream';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(createUserDto: CreateUserDto, school, major): Promise<User> {
    const { email, password, phone, nickname, manager, name, photo_url } =
      createUserDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({
      email,
      school,
      major,
      salt: hashedPassword,
      name,
      phone,
      nickname,
      manager,
      photo_url,
    });

    try {
      await user.save();
      return user;
    } catch (e) {
      throw new InternalServerErrorException(
        '서버에러입니다 서버 담당자에게 말해주세요',
      );
    }
  }

  async findOneUser(no: number) {
    try {
      const user = await this.createQueryBuilder('users')
        .leftJoinAndSelect('users.school', 'school')
        .where('users.no = :no', { no })
        .andWhere('users.school = school.no')
        .getOne();

      return user;
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} ### 유저 프로필 선택 조회 : 알 수 없는 서버 에러입니다.`,
      );
    }
  }
  async duplicateCheck(email, nickname) {
    try {
      const duplicate = await this.createQueryBuilder('users')
        .select()
        .where('users.email= :email', { email })
        .orWhere('users.nickname =:nickname', { nickname })
        .getOne();
      return duplicate;
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} ### 중복체크 : 알 수 없는 서버 에러입니다.`,
      );
    }
  }
}
