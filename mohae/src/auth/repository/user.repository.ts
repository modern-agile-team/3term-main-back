import { EntityRepository, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from '../dto/auth-credential.dto';
import { User } from '../entity/user.entity';
import * as bcrypt from 'bcryptjs';
import { InternalServerErrorException } from '@nestjs/common';
import { resourceLimits } from 'worker_threads';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  // 인증 관련 부분
  async createUser(createUserDto: CreateUserDto, school, major): Promise<any> {
    try {
      const { email, password, phone, nickname, manager, name, photo_url } =
        createUserDto;

      const { raw } = await this.createQueryBuilder('users')
        .insert()
        .into(User)
        .values([
          {
            email,
            school,
            major,
            name,
            phone,
            nickname,
            manager,
            photo_url,
            salt: password,
          },
        ])
        .execute();
      return raw.insertId;
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} ### 회원 가입도중 발생한 서버에러입니다 서버 담당자에게 말해주세요`,
      );
    }
  }

  async signIn(email: string) {
    try {
      const user = await this.createQueryBuilder('users')
        .addSelect('users.salt')
        .where('users.email = :email', { email })
        .getOne();

      return user;
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} ### 로그인 : 알 수 없는 서버 에러입니다.`,
      );
    }
  }

  async signDown(no: number): Promise<number> {
    try {
      const raw = await this.createQueryBuilder()
        .softDelete()
        .from(User)
        .where('no = :no', { no })
        .execute();
      return raw.affected;
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} ##### 회원 탈퇴 도중 발생한 서버에러`,
      );
    }
  }
  async duplicateCheck(string, duplicateCheck): Promise<User> {
    try {
      const duplicate = await this.createQueryBuilder('users')
        .where(`users.${string}= :duplicateCheck`, { duplicateCheck })
        .getOne();

      return duplicate;
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} ##### 중복체크 확인 중 알 수 없는 서버 에러입니다.`,
      );
    }
  }

  async clearLoginCount(userNo): Promise<void> {
    try {
      await this.createQueryBuilder()
        .update(User)
        .set({ loginFailCount: 0 })
        .where('no = :userNo', { userNo })
        .execute();
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} ##### 로그인 성공시 로그인 시도 횟수 초기화 도중 발생한 서버에러`,
      );
    }
  }

  async plusLoginFailCount({ no, loginFailCount }): Promise<number> {
    try {
      const { affected } = await this.createQueryBuilder()
        .update(User)
        .set({ loginFailCount: loginFailCount + 1 })
        .where('no = :no', { no })
        .execute();

      return affected;
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} ##### 로그인 실패시 실패 횟수 올리는 도중 발생한 서버에러`,
      );
    }
  }
  async changeIsLock(userNo, isLock): Promise<UpdateResult> {
    try {
      return await this.createQueryBuilder()
        .update(User)
        .set({ isLock: !isLock })
        .where('no = :userNo', { userNo })
        .execute();
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} ##### changeIsLock 관련 오류`,
      );
    }
  }

  async checkLoginTerm(userNo): Promise<any> {
    try {
      const { term } = await this.createQueryBuilder('users')
        .select('timestampdiff(second, latestLogin, now()) AS term')
        .where('no = :userNo', { userNo })
        .getRawOne();

      return term;
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} ##### 로그인 시간차 관련 서버에러`,
      );
    }
  }

  async changePassword(email, hashedPassword): Promise<UpdateResult> {
    try {
      return await this.createQueryBuilder()
        .update(User)
        .set({ salt: hashedPassword })
        .where('email = :email', { email })
        .execute();
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} ##### 비밀번호 변경중 발생한 서버에러`,
      );
    }
  }
  // 프로필 관련 기능
  async findOneUser(no: number): Promise<User> {
    try {
      const user = await this.createQueryBuilder('users')
        .leftJoinAndSelect('users.boards', 'boards')
        .leftJoinAndSelect('users.school', 'school')
        .leftJoinAndSelect('users.major', 'major')
        .leftJoinAndSelect('users.reports', 'reports')
        .leftJoinAndSelect('users.specs', 'specs')
        .leftJoinAndSelect('users.categories', 'categories')
        .leftJoinAndSelect('users.likedUser', 'likedUser')
        .select([
          'users.no',
          'users.email',
          'users.nickname',
          `users.createdAt`,
          'users.name',
          'users.photo_url',
          'likedUser',
          'boards.no',
          'boards.title',
          'boards.target',
          'school.no',
          'school.name',
          'major.no',
          'major.name',
          'specs.no',
          'specs.title',
          'categories.no',
          'categories.name',
        ])
        .where('users.no = :no', { no })
        .getOne();

      return user;
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} ### 유저 프로필 선택 조회 : 알 수 없는 서버 에러입니다.`,
      );
    }
  }

  async findOneUserinfo(no: number): Promise<User> {
    try {
      const user = await this.createQueryBuilder('users')
        .select(['no', 'email', 'nickname', 'name'])
        .where('no = :no', { no })
        .getOne();

      return user;
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} ##### 프로필 회원 조회 도중 발생한 서버에러`,
      );
    }
  }

  async userRelation(no, value, relation): Promise<void> {
    try {
      await this.createQueryBuilder()
        .relation(User, relation)
        .of(no)
        .add(value);
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} 유저 관계형성 도중 생긴 오류`,
      );
    }
  }
}
