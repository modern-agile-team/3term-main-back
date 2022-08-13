import {
  BadRequestException,
  CACHE_MANAGER,
  ConflictException,
  ForbiddenException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './repository/user.repository';
import { SchoolRepository } from 'src/schools/repository/school.repository';
import { MajorRepository } from 'src/majors/repository/major.repository';
import { CategoryRepository } from 'src/categories/repository/category.repository';
import {
  TermsReporitory,
  TermsUserReporitory,
} from 'src/terms/repository/terms.repository';
import { User } from './entity/user.entity';
import { School } from 'src/schools/entity/school.entity';
import { Major } from 'src/majors/entity/major.entity';
import { Category } from 'src/categories/entity/category.entity';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ErrorConfirm } from 'src/common/utils/error';
import { Connection, QueryRunner } from 'typeorm';
import { Cache } from 'cache-manager';

import * as bcrypt from 'bcryptjs';

export interface UserPayload {
  userNo: number;
  email: string;
  nickname: string;
  photoUrl: string | null;
  issuer: string;
  manager: boolean;
  expiration: number;
  token: string;
  exp?: number;
}

export interface Token {
  accessToken: string;
  refreshToken: string;
}

interface CreatedUser {
  user: User;
  schoolNo: School;
  majorNo: Major;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private userRepository: UserRepository,
    private schoolRepository: SchoolRepository,
    private majorRepository: MajorRepository,
    private categoriesRepository: CategoryRepository,
    private connection: Connection,
    private errorConfirm: ErrorConfirm,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async hardDeleteUser(): Promise<number> {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const hardDeletedUserNum: number = await queryRunner.manager
        .getCustomRepository(UserRepository)
        .hardDeleteUser();

      await queryRunner.commitTransaction();

      return hardDeletedUserNum;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async signUp(signUpDto: SignUpDto): Promise<Record<string, string>> {
    const queryRunner: QueryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { email, nickname, categories, terms }: SignUpDto = signUpDto;

      await this.duplicateCheckForSignUp(email, nickname);

      const createdUser: CreatedUser = await this.createUser(
        signUpDto,
        queryRunner,
      );

      await this.createRelationsForSignUp(
        createdUser,
        categories,
        terms,
        queryRunner,
      );
      await queryRunner.commitTransaction();

      return { email, nickname };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async createUser(signUpDto: SignUpDto, queryRunner: QueryRunner) {
    try {
      const { school, major, password }: SignUpDto = signUpDto;
      const schoolNo: School | null = school
        ? await this.schoolRepository.findOne(school, {
            select: ['no'],
          })
        : null;
      const majorNo: Major | null = major
        ? await this.majorRepository.findOne(major, {
            select: ['no'],
          })
        : null;
      const salt: string = await bcrypt.genSalt();
      const hashedPassword: string = await bcrypt.hash(password, salt);

      signUpDto.password = hashedPassword;

      const user: User = await queryRunner.manager
        .getCustomRepository(UserRepository)
        .createUser(signUpDto, schoolNo, majorNo);

      this.errorConfirm.badGatewayError(user, 'user 생성 실패');

      return { user, schoolNo, majorNo };
    } catch (err) {
      throw err;
    }
  }

  async createRelationsForSignUp(
    { user, schoolNo, majorNo }: CreatedUser,
    categories: Category[],
    terms: number[],
    queryRunner: QueryRunner,
  ) {
    try {
      const categoriesRepo: Category[] =
        await this.categoriesRepository.selectCategory(categories);
      const userPickCategories: number[] = categoriesRepo.map((category) => {
        return category.no;
      });

      await queryRunner.manager
        .getCustomRepository(CategoryRepository)
        .AddUser(userPickCategories, user);

      const termsArr: object[] = terms.map((boolean, index) => {
        return {
          agree: boolean,
          user: user,
          terms: index + 1,
        };
      });

      const termsUserNums: object[] = await queryRunner.manager
        .getCustomRepository(TermsUserReporitory)
        .addTermsUser(termsArr);

      termsUserNums.forEach((termsUserNum, index) => {
        queryRunner.manager
          .getCustomRepository(TermsReporitory)
          .termsAddRelation(index + 1, termsUserNum['no']);
        queryRunner.manager
          .getCustomRepository(UserRepository)
          .userRelation(user, termsUserNum['no'], 'userTerms');
      });

      if (schoolNo) {
        await queryRunner.manager
          .getCustomRepository(SchoolRepository)
          .addUser(schoolNo, user);
      }
      if (majorNo) {
        await queryRunner.manager
          .getCustomRepository(MajorRepository)
          .addUser(majorNo, user);
      }
    } catch (err) {
      throw err;
    }
  }

  async duplicateCheckForSignUp(email: string, nickname: string) {
    const duplicateEmail: User = await this.userRepository.duplicateCheck(
      'email',
      email,
    );
    const duplicateNickname: User = await this.userRepository.duplicateCheck(
      'nickname',
      nickname,
    );
    const duplicateObj: object = {
      이메일: duplicateEmail,
      닉네임: duplicateNickname,
    };
    const duplicateKeys: Array<string> = Object.keys(duplicateObj).filter(
      (key) => duplicateObj[key],
    );

    if (duplicateKeys.length) {
      throw new ConflictException(`해당 ${duplicateKeys}이 이미 존재합니다.`);
    }
  }

  async signIn(signInDto: SignInDto): Promise<Token> {
    const userInfo: User = await this.confirmUser(signInDto);

    await this.passwordConfirm(userInfo, signInDto.password);

    const token: Token = await this.createJwtToken(userInfo);

    return token;
  }

  async passwordConfirm(user: User, password: string) {
    const isPassword: boolean = await bcrypt.compare(password, user.salt);

    if (isPassword) {
      await this.userRepository.clearLoginCount(user.no);

      if (user.deletedAt) {
        await this.userRepository.cancelSignDown(user.email);
      }
      return;
    }
    await this.userRepository.plusLoginFailCount(user);

    const afterUser: User = await this.userRepository.confirmUser(user.email);

    if (afterUser.loginFailCount >= 5) {
      await this.userRepository.changeIsLock(afterUser.no, afterUser.isLock);
    }
    throw new UnauthorizedException(
      `아이디 또는 비밀번호가 일치하지 않습니다. 로그인 실패 횟수: ${afterUser.loginFailCount} `,
    );
  }

  async confirmUser(signInDto: SignInDto): Promise<User> {
    const { email }: SignInDto = signInDto;
    const user: User = await this.userRepository.confirmUser(email);

    this.errorConfirm.notFoundError(
      user,
      '아이디 또는 비밀번호가 일치하지 않습니다.',
    );

    if (!user.isLock) {
      return user;
    }

    const loginTerm: number = await this.userRepository.checkLoginTerm(user.no);

    if (loginTerm > 10) {
      await this.userRepository.changeIsLock(user.no, user.isLock);
      return user;
    } else
      throw new UnauthorizedException(
        `로그인 실패 횟수를 모두 초과 하였습니다 ${Math.floor(
          10 - loginTerm,
        )}초 뒤에 다시 로그인 해주세요. 실패횟수 ${user.loginFailCount}`,
      );
  }

  async signDown(user: User, password: string): Promise<void> {
    const { email, no }: User = user;
    const { salt }: User = await this.userRepository.confirmUser(email);
    const isPassword: boolean = await bcrypt.compare(password, salt);

    if (isPassword) {
      const affected: number = await this.userRepository.signDown(no);

      if (!affected) {
        throw new InternalServerErrorException(
          `${no} 회원님의 회원탈퇴가 정상적으로 이루어 지지 않았습니다.`,
        );
      }
    } else {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }
  }

  async modifyPassword(
    email: string,
    changePassword: string,
    confirmChangePassword: string,
    user: User,
  ): Promise<number> {
    if (changePassword !== confirmChangePassword) {
      throw new BadRequestException(
        '새비밀번호와 새비밀번호 확인이 일치하지 않습니다',
      );
    }

    if (user) {
      const salt: string = await bcrypt.genSalt();
      const hashedPassword: string = await bcrypt.hash(changePassword, salt);
      const affected: number = await this.userRepository.changePassword(
        email,
        hashedPassword,
      );
      if (affected) return affected;

      throw new InternalServerErrorException(
        '비밀번호 변경중 알 수 없는 오류입니다.',
      );
    }
    throw new UnauthorizedException('존재하지 않는 이메일 입니다.');
  }

  async changePassword(changePasswordDto: ChangePasswordDto): Promise<void> {
    const {
      email,
      nowPassword,
      changePassword,
      confirmChangePassword,
    }: ChangePasswordDto = changePasswordDto;
    const user: User = await this.userRepository.signIn(email);
    const isPassword: boolean = await bcrypt.compare(nowPassword, user.salt);

    if (!isPassword) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }
    if (nowPassword === changePassword) {
      throw new ConflictException('이전의 비밀번호로는 변경하실 수 없습니다.');
    }
    await this.modifyPassword(
      email,
      changePassword,
      confirmChangePassword,
      user,
    );
  }

  async forgetPassword(
    forgetPasswordDto: ForgetPasswordDto,
    key: string,
  ): Promise<void> {
    if (key !== forgetPasswordDto.email)
      throw new ForbiddenException(
        '가입하신 이메일로만 비밀번호 변경이 가능합니다.',
      );
    await this.getTokenCacheData(key);

    const { email, changePassword, confirmChangePassword }: ForgetPasswordDto =
      forgetPasswordDto;
    const user: User = await this.userRepository.signIn(email);
    const isPassword: boolean = await bcrypt.compare(changePassword, user.salt);

    if (isPassword) {
      throw new ConflictException('이전 비밀번호로는 변경하실 수 없습니다.');
    }
    await this.modifyPassword(
      email,
      changePassword,
      confirmChangePassword,
      user,
    );
  }

  async createJwtToken(user: User) {
    try {
      const payload: UserPayload = {
        userNo: user.no,
        email: user.email,
        nickname: user.nickname,
        photoUrl: user['photo_url'],
        issuer: 'modern-agile',
        manager: user.manager,
        expiration: this.configService.get<number>('EXPIRES_IN'),
        token: 'accessToken',
      };
      const accessToken: string = this.jwtService.sign(payload);

      payload.expiration = this.configService.get<number>(
        'REFRESHTOCKEN_EXPIRES_IN',
      );
      payload.token = 'refreshToken';

      const refreshToken: string = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<number>('REFRESHTOCKEN_EXPIRES_IN'),
      });

      await this.cacheManager.set(String(user.no) + 'access', accessToken, {
        ttl: await this.configService.get('EXPIRES_IN'),
      });
      await this.cacheManager.set(String(user.no) + 'refresh', refreshToken, {
        ttl: await this.configService.get('REFRESHTOCKEN_EXPIRES_IN'),
      });

      return { accessToken, refreshToken };
    } catch (err) {
      throw err;
    }
  }

  async validateAccessToken(jwtFromRequest: UserPayload): Promise<any> {
    const { email, userNo } = jwtFromRequest;
    const { salt, ...user }: User = await this.userRepository.signIn(email);
    const accessToken: string = await this.cacheManager.get<string>(
      String(userNo) + 'access',
    );

    if (!user || !accessToken) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async createAccessToken(payload: UserPayload) {
    const preAccessToken: string = await this.cacheManager.get<string>(
      String(payload.userNo) + 'access',
    );
    const refreshToken: string = await this.cacheManager.get<string>(
      String(payload.userNo) + 'refresh',
    );

    if (!!preAccessToken || !refreshToken) {
      await this.cacheManager.del(String(payload.userNo) + 'access');
      await this.cacheManager.del(String(payload.userNo) + 'refresh');

      if (!!preAccessToken) {
        throw new HttpException(
          'access 토큰이 만료되기 이전에는 재발급 할 수 없습니다. 다시 로그인 해주세요',
          410,
        );
      }
      throw new HttpException(
        '모든 토큰이 만료 되었습니다. 다시 로그인 해주세요',
        410,
      );
    }

    const newPayload: UserPayload = {
      userNo: payload.userNo,
      email: payload.email,
      nickname: payload.nickname,
      photoUrl: payload.photoUrl,
      issuer: 'modern-agile',
      manager: payload.manager,
      expiration: this.configService.get<number>('EXPIRES_IN'),
      token: 'accessToken',
    };
    const accessToken: string = this.jwtService.sign(newPayload);

    await this.cacheManager.set(
      String(payload.userNo) + 'access',
      accessToken,
      {
        ttl: this.configService.get('EXPIRES_IN'),
      },
    );
    throw new UnauthorizedException(`${accessToken}`);
  }

  async deleteRefreshToken({ no }: User) {
    try {
      const isToken = await this.cacheManager.get<Token>(String(no));

      if (isToken) {
        await this.cacheManager.del(String(no));
      }
    } catch (err) {
      throw err;
    }
  }

  async getTokenCacheData(key: string) {
    const token: string | null = await this.cacheManager.get<string>(key);

    if (!token) {
      throw new UnauthorizedException('유효시간이 만료된 토큰 입니다.');
    }
  }
}
