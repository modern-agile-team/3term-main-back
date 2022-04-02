import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from '../dto/auth-credential.dto';
import { User } from '../entity/user.entity';
import * as bcrypt from 'bcryptjs';
import { Duplex } from 'stream';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { timeStamp } from 'console';

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
      console.log(e);
      throw new InternalServerErrorException(
        '서버에러입니다 서버 담당자에게 말해주세요',
      );
    }
  }

  async signIn(email: string) {
    try {
      const user = await this.createQueryBuilder('users')
        .where('users.email = :email', { email })
        .getOne();

      return user;
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} ### 로그인 : 알 수 없는 서버 에러입니다.`,
      );
    }
  }

  async findOneUser(no: number) {
    try {
      const user = await this.createQueryBuilder('users')
        .leftJoinAndSelect('users.school', 'school')
        .leftJoinAndSelect('users.reports', 'reports')
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

  async findOneUserinfo(no: number) {
    try {
      const user = await this.createQueryBuilder('users')
        .select(['no', 'email', 'nickname', 'name'])
        .where('no = :no', { no })
        .getOne();

      return user;
    } catch (err) {
      throw err;
    }
  }

  async signDown(no: number) {
    const result = await this.createQueryBuilder()
      .softDelete()
      .from(User)
      .where('no = :no', { no })
      .execute();
    return result;
  }
  async duplicateCheck(string, duplicateCheck) {
    try {
      const duplicate = await this.createQueryBuilder('users')
        .where(`users.${string}= :duplicateCheck`, { duplicateCheck })
        .getOne();
      return duplicate;
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} ### 중복체크 : 알 수 없는 서버 에러입니다.`,
      );
    }
  }

  async clearLoginCount(userNo) {
    try {
      await this.createQueryBuilder()
        .update(User)
        .set({ loginFailCount: 0 })
        .where('no = :no', { no: userNo })
        .execute();
    } catch (e) {
      throw e;
    }
  }

  async plusLoginFailCount({ no, loginFailCount }) {
    try {
      const { affected } = await this.createQueryBuilder()
        .update(User)
        .set({ loginFailCount: loginFailCount + 1 })
        .where('no = :no', { no })
        .execute();

      return affected;
    } catch (e) {
      throw e;
    }
  }
  async changeIsLock(userNo, isLock) {
    try {
      return await this.createQueryBuilder()
        .update(User)
        .set({ isLock: !isLock })
        .where('no = :no', { no: userNo })
        .execute();
    } catch (e) {
      throw e;
    }
  }

  async changePassword(email, hashedPassword) {
    try {
      return await this.createQueryBuilder()
        .update(User)
        .set({ salt: hashedPassword })
        .where('email = :email', { email })
        .execute();
    } catch (e) {
      throw e;
    }
  }
}
