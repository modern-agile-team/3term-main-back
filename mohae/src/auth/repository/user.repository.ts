import { InternalServerErrorException } from '@nestjs/common';
import {
  DeleteResult,
  EntityRepository,
  Repository,
  UpdateResult,
} from 'typeorm';
import { User } from '../entity/user.entity';
import { School } from 'src/schools/entity/school.entity';
import { Major } from 'src/majors/entity/major.entity';
import { SignUpDto } from '../dto/sign-up.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  // 인증 관련 부분
  async createUser(
    createUserDto: SignUpDto,
    school: School,
    major: Major,
  ): Promise<User> {
    try {
      const { email, password, phone, nickname, manager, name }: SignUpDto =
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

  async cancelSignDown(email: string): Promise<void> {
    try {
      await this.createQueryBuilder('users')
        .update(User)
        .set({ deletedAt: null })
        .where('users.email = :email', { email })
        .execute();
    } catch (err) {
      throw new InternalServerErrorException(
        `${err} 로그인 도중 유저 cancelSignDown 관련 서버에러`,
      );
    }
  }

  async confirmUser(email: string): Promise<User> {
    try {
      const user: User = await this.createQueryBuilder('users')
        .leftJoin('users.profilePhoto', 'profilePhoto')
        .select([
          'users.no AS no',
          'users.salt AS salt',
          'users.email AS email',
          'users.isLock AS isLock',
          'users.latestLogin AS latestLogin',
          'users.loginFailCount AS loginFailCount',
          'users.manager AS manager',
          'users.nickname AS nickname',
          'profilePhoto.photo_url AS photo_url',
          'users.deletedAt AS deletedAt',
        ])
        .withDeleted()
        .where('users.email = :email', { email })
        .getRawOne();
      return user;
    } catch (err) {
      throw new InternalServerErrorException(
        `${err} 로그인 도중 유저 comfirm 관련 서버에러`,
      );
    }
  }

  async signDown(no: number): Promise<number> {
    try {
      const { affected }: DeleteResult = await this.createQueryBuilder()
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

  async readUserProfile(profileUserNo: number, userNo: number): Promise<User> {
    try {
      const profile: User = await this.createQueryBuilder('users')
        .leftJoin('users.school', 'school')
        .leftJoin('users.major', 'major')
        .leftJoin('users.categories', 'categories')
        .leftJoin('users.likedUser', 'likedUser')
        .leftJoin('users.profilePhoto', 'profilePhoto')
        .leftJoin('users.boards', 'boards')
        .select([
          'users.no AS userNo',
          'users.email AS email',
          'users.nickname AS nickname',
          'users.phone AS phone',
          `DATE_FORMAT(users.createdAt, '%Y.%m.%d') AS createdAt`,
          'users.name AS name',
          'profilePhoto.photo_url AS photo_url',
          'COUNT(DISTINCT boards.no) AS boardNum',
          'COUNT(DISTINCT likedUser.no) AS likedUserNum',
          `EXISTS(SELECT no FROM user_like WHERE user_like.likedMeNo = ${userNo} AND user_like.likedUserNo = ${profileUserNo}) AS isLike`,
          'school.no AS schoolNo',
          'school.name AS schoolName',
          'major.no AS majorNo',
          'major.name AS majorName',
          'GROUP_CONCAT(DISTINCT CONCAT_WS(",", categories.no ,categories.name) SEPARATOR "|") AS categoryNo',
        ])
        .where('users.no = :profileUserNo', { profileUserNo })
        .getRawOne();

      return profile;
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

  async updateProfile(userNo: User, deletedNullprofile: object): Promise<void> {
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

  async hardDeleteUser(): Promise<number> {
    try {
      const { affected }: DeleteResult = await this.createQueryBuilder('users')
        .delete()
        .from(User)
        .where('users.deleted_At is not null')
        .andWhere('DATE_ADD(users.deleted_At, INTERVAL 15 DAY) >= NOW()')
        .execute();
      return affected;
    } catch (err) {
      throw new InternalServerErrorException(
        `${err} 유저 hard Delete 중 알 수 없는 서버 에러입니다.`,
      );
    }
  }
}
