import {
  EntityRepository,
  Repository,
  SelectQueryBuilder,
  Timestamp,
  UpdateResult,
} from 'typeorm';
import { CreateUserDto } from '../dto/auth-credential.dto';
import { User } from '../entity/user.entity';
import { InternalServerErrorException } from '@nestjs/common';
import { School } from 'src/schools/entity/school.entity';
import { Major } from 'src/majors/entity/major.entity';
import { QLDB } from 'aws-sdk';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  // 인증 관련 부분
  async createUser(
    createUserDto: CreateUserDto,
    school: School,
    major: Major,
  ): Promise<User> {
    try {
      const { email, password, phone, nickname, manager, name }: CreateUserDto =
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
            salt: password,
          },
        ])
        .execute();
      return raw.insertId;
    } catch (err) {
      throw new InternalServerErrorException(
        `${err} ### 회원 가입도중 발생한 서버에러입니다 서버 담당자에게 말해주세요`,
      );
    }
  }

  async signIn(email: string): Promise<User> {
    try {
      return await this.createQueryBuilder('users')
        .addSelect('users.salt')
        .where('users.email = :email', { email })
        .getOne();
    } catch (err) {
      throw new InternalServerErrorException(
        `${err} ### 로그인 : 알 수 없는 서버 에러입니다.`,
      );
    }
  }

  async confirmUser(email: string): Promise<User> {
    try {
      const user: User = await this.createQueryBuilder('users')
        .select([
          'users.no',
          'users.salt',
          'users.email',
          'users.isLock',
          'users.latestLogin',
          'users.loginFailCount',
        ])
        .where('users.email = :email', { email })
        .getOne();

      return user;
    } catch (err) {
      throw new InternalServerErrorException(
        `${err} 로그인 도중 유저 comfirm 관련 서버에러`,
      );
    }
  }

  async signDown(no: number): Promise<number> {
    try {
      const { affected }: UpdateResult = await this.createQueryBuilder()
        .softDelete()
        .from(User)
        .where('no = :no', { no })
        .execute();
      return affected;
    } catch (err) {
      throw new InternalServerErrorException(
        `${err} ##### 회원 탈퇴 도중 발생한 서버에러`,
      );
    }
  }
  async duplicateCheck(string: string, duplicateCheck: string): Promise<User> {
    try {
      const duplicate: User = await this.createQueryBuilder('users')
        .select(['users.no', 'users.nickname'])
        .where(`users.${string}= :duplicateCheck`, { duplicateCheck })
        .getOne();

      return duplicate;
    } catch (err) {
      throw new InternalServerErrorException(
        `${err} ##### 중복체크 확인 중 알 수 없는 서버 에러입니다.`,
      );
    }
  }

  async clearLoginCount(userNo: number): Promise<number> {
    try {
      const { affected }: UpdateResult = await this.createQueryBuilder()
        .update(User)
        .set({ loginFailCount: 0 })
        .where('no = :userNo', { userNo })
        .execute();
      return affected;
    } catch (err) {
      throw new InternalServerErrorException(
        `${err} ##### 로그인 성공시 로그인 시도 횟수 초기화 도중 발생한 서버에러`,
      );
    }
  }

  async plusLoginFailCount({ no, loginFailCount }): Promise<number> {
    try {
      const { affected }: UpdateResult = await this.createQueryBuilder()
        .update(User)
        .set({ loginFailCount: loginFailCount + 1 })
        .where('no = :no', { no })
        .execute();

      return affected;
    } catch (err) {
      throw new InternalServerErrorException(
        `${err} ##### 로그인 실패시 실패 횟수 올리는 도중 발생한 서버에러`,
      );
    }
  }
  async changeIsLock(userNo: number, isLock: boolean): Promise<number> {
    try {
      const { affected }: UpdateResult = await this.createQueryBuilder()
        .update(User)
        .set({ isLock: !isLock })
        .where('no = :userNo', { userNo })
        .execute();
      return affected;
    } catch (err) {
      throw new InternalServerErrorException(
        `${err} ##### changeIsLock 관련 오류`,
      );
    }
  }

  async checkLoginTerm(userNo: number): Promise<number> {
    try {
      const { term }: any = await this.createQueryBuilder('users')
        .select('timestampdiff(second, latestLogin, now()) AS term')
        .where('no = :userNo', { userNo })
        .getRawOne();
      return term;
    } catch (err) {
      throw new InternalServerErrorException(
        `${err} ##### 로그인 시간차 관련 서버에러`,
      );
    }
  }

  async changePassword(email: string, hashedPassword: string): Promise<number> {
    try {
      const { affected }: UpdateResult = await this.createQueryBuilder()
        .update(User)
        .set({ salt: hashedPassword })
        .where('email = :email', { email })
        .execute();
      return affected;
    } catch (err) {
      throw new InternalServerErrorException(
        `${err} ##### 비밀번호 변경중 발생한 서버에러`,
      );
    }
  }
  // 프로필 관련 기능
  async readUserProfile(userNo: number): Promise<object> {
    try {
      const profile: User = await this.createQueryBuilder('users')
        .leftJoin('users.school', 'school')
        .leftJoin('users.major', 'major')
        .leftJoin('users.categories', 'categories')
        .leftJoin('users.likedUser', 'likedUser')
        .leftJoin('users.profilePhoto', 'profilePhoto')
        .select([
          'users.no',
          'users.email',
          'users.nickname',
          `users.createdAt`,
          'users.name',
          'profilePhoto.photo_url',
          'likedUser',
          'school.no',
          'school.name',
          'major.no',
          'major.name',
          'categories.no',
          'categories.name',
        ])
        .where('users.no = :userNo', { userNo })
        .getOne();

      const { boardsCount }: any = await this.createQueryBuilder('users')
        .leftJoin('users.boards', 'boards')
        .select('COUNT(boards.no) AS boardsNum')
        .where('users.no = :userNo', { userNo })
        .getRawOne();

      return { profile, boardsCount };
    } catch (err) {
      throw new InternalServerErrorException(
        `${err} ### 유저 프로필 선택 조회 : 알 수 없는 서버 에러입니다.`,
      );
    }
  }

  async userRelation(no: any, value: any, relation: string): Promise<void> {
    try {
      await this.createQueryBuilder()
        .relation(User, relation)
        .of(no)
        .add(value);
    } catch (err) {
      throw new InternalServerErrorException(
        `${err} 유저 관계형성 도중 생긴 오류`,
      );
    }
  }

  async updateProfile(userNo: User, deletedNullprofile: object) {
    try {
      await this.createQueryBuilder('users')
        .update(User)
        .set(deletedNullprofile)
        .where('no = :userNo', { userNo })
        .execute();
    } catch (err) {
      throw new InternalServerErrorException(
        `${err} 프로필 업데이트 중 알 수 없는 서버 에러입니다.`,
      );
    }
  }
}
