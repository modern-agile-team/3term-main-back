import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { getCustomRepositoryToken, InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './repository/user.repository';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from './entity/user.entity';
import { SchoolRepository } from 'src/schools/repository/school.repository';
import { MajorRepository } from 'src/majors/repository/major.repository';
import { CategoryRepository } from 'src/categories/repository/category.repository';
import { ErrorConfirm } from 'src/common/utils/error';
import { School } from 'src/schools/entity/school.entity';
import { Major } from 'src/majors/entity/major.entity';
import { Category } from 'src/categories/entity/category.entity';
import { Connection } from 'typeorm';
import {
  TermsReporitory,
  TermsUserReporitory,
} from 'src/terms/repository/terms.repository';
import { Terms } from 'src/terms/entity/terms.entity';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { SignDownDto } from './dto/auth-credential.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private schoolRepository: SchoolRepository,
    private majorRepository: MajorRepository,
    private categoriesRepository: CategoryRepository,
    private connection: Connection,
    private errorConfirm: ErrorConfirm,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async signUp(signUpDto: SignUpDto): Promise<object> {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const {
        school,
        major,
        email,
        nickname,
        categories,
        password,
        terms,
      }: SignUpDto = signUpDto;
      const schoolRepo: School = await this.schoolRepository.findOne(school, {
        select: ['no'],
      });
      const majorRepo: Major = await this.majorRepository.findOne(major, {
        select: ['no'],
      });

      if (!schoolRepo || !majorRepo) {
        const notFoundObj: object = { 학교: schoolRepo, 전공: majorRepo };
        const notFoundKey: Array<string> = Object.keys(notFoundObj).filter(
          (key) => !notFoundObj[key],
        );
        if (notFoundKey.length) {
          throw new NotFoundException(
            `해당 번호에 해당하는 ${notFoundKey}이(가) 존재하지 않습니다.`,
          );
        }
      }

      const categoriesRepo: Array<Category> =
        await this.categoriesRepository.selectCategory(categories);
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

      const salt: string = await bcrypt.genSalt();
      const hashedPassword: string = await bcrypt.hash(password, salt);
      signUpDto.password = hashedPassword;

      const user: User = await queryRunner.manager
        .getCustomRepository(UserRepository)
        .createUser(signUpDto, schoolRepo, majorRepo);
      this.errorConfirm.badGatewayError(user, 'user 생성 실패');
      const termsArr: Array<object> = terms.map((boolean, index) => {
        return {
          agree: boolean,
          user: user,
          terms: index + 1,
        };
      });
      const termsUserNums: Array<object> = await queryRunner.manager
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

      const filteredCategories: Array<Category> = categoriesRepo.filter(
        (element) => element !== undefined,
      );
      for (const categoryNo of filteredCategories) {
        await queryRunner.manager
          .getCustomRepository(CategoryRepository)
          .addUser(categoryNo.no, user);
      }
      await queryRunner.manager
        .getCustomRepository(SchoolRepository)
        .addUser(schoolRepo.no, user);
      await queryRunner.manager
        .getCustomRepository(MajorRepository)
        .addUser(majorRepo.no, user);

      await queryRunner.commitTransaction();

      return { email, nickname };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async passwordConfirm(user: User, password: string) {
    try {
      const isPassword: boolean = await bcrypt.compare(password, user.salt);

      if (isPassword) {
        const payload: object = {
          userNo: user.no,
          email: user.email,
          nickname: user.nickname,
          photoUrl: user['photo_url'],
          issuer: 'modern-agile',
          expiration: this.configService.get<number>('EXPIRES_IN'),
        };
        await this.userRepository.clearLoginCount(user.no);

        const accessToken: string = this.jwtService.sign(payload);
        return accessToken;
      }
      await this.userRepository.plusLoginFailCount(user);
      const afterUser = await this.userRepository.findOne(user.no);
      if (afterUser.loginFailCount >= 5) {
        await this.userRepository.changeIsLock(afterUser.no, afterUser.isLock);
      }
      throw new UnauthorizedException(
        `아이디 또는 비밀번호가 일치하지 않습니다. 로그인 실패 횟수: ${afterUser.loginFailCount} `,
      );
    } catch (err) {
      throw err;
    }
  }

  async confirmUser(signInDto: SignInDto) {
    try {
      const { email }: SignInDto = signInDto;
      const user: User = await this.userRepository.confirmUser(email);
      this.errorConfirm.notFoundError(
        user,
        '아이디 또는 비밀번호가 일치하지 않습니다.',
      );
      if (!user.isLock) {
        return user;
      }
      const loginTerm: number = await this.userRepository.checkLoginTerm(
        user.no,
      );
      if (loginTerm > 10) {
        await this.userRepository.changeIsLock(user.no, user.isLock);
        return user;
      } else
        throw new UnauthorizedException(
          `로그인 실패 횟수를 모두 초과 하였습니다 ${Math.floor(
            10 - loginTerm,
          )}초 뒤에 다시 로그인 해주세요. 실패횟수 ${user.loginFailCount}`,
        );
    } catch (err) {
      throw err;
    }
  }

  async signDown(
    userNo: number,
    userEmail: string,
    { email }: SignDownDto,
  ): Promise<void> {
    try {
      if (userEmail !== email) {
        throw new UnauthorizedException(
          '회원님의 이메일이 일치 하지 않습니다.',
        );
      }
      const affected: number = await this.userRepository.signDown(userNo);
      if (!affected) {
        throw new InternalServerErrorException(
          `${userNo} 회원님의 회원탈퇴가 정상적으로 이루어 지지 않았습니다.`,
        );
      }
    } catch (err) {
      throw err;
    }
  }

  async changePassword(changePasswordDto: ChangePasswordDto): Promise<number> {
    try {
      const {
        email,
        nowPassword,
        changePassword,
        confirmChangePassword,
      }: ChangePasswordDto = changePasswordDto;

      if (changePassword !== confirmChangePassword) {
        throw new BadRequestException(
          '새비밀번호와 새비밀번호 확인이 일치하지 않습니다',
        );
      }
      const user: User = await this.userRepository.signIn(email);
      const isPassword: boolean = await bcrypt.compare(nowPassword, user.salt);
      if (user && isPassword) {
        if (nowPassword === changePassword) {
          throw new ConflictException(
            '이전의 비밀번호로는 변경하실 수 없습니다.',
          );
        }
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
      throw new UnauthorizedException(
        '아이디 또는 비밀번호가 일치하지 않습니다.',
      );
    } catch (err) {
      throw err;
    }
  }
  async forgetPassword(forgetPasswordDto: ForgetPasswordDto): Promise<number> {
    try {
      const {
        email,
        changePassword,
        confirmChangePassword,
      }: ForgetPasswordDto = forgetPasswordDto;

      if (changePassword !== confirmChangePassword) {
        throw new BadRequestException(
          '새비밀번호와 새비밀번호 확인이 일치하지 않습니다',
        );
      }
      const user: User = await this.userRepository.signIn(email);

      if (user) {
        const isPassword: boolean = await bcrypt.compare(
          changePassword,
          user.salt,
        );

        if (isPassword) {
          throw new ConflictException(
            '이전 비밀번호로는 변경하실 수 없습니다.',
          );
        }
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
    } catch (err) {
      throw err;
    }
  }
}
