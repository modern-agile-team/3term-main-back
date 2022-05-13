import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ChangePasswordDto,
  CreateUserDto,
  ForgetPasswordDto,
  SignInDto,
} from './dto/auth-credential.dto';
import { UserRepository } from './repository/user.repository';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from './entity/user.entity';
import { SchoolRepository } from 'src/schools/repository/school.repository';
import { UpdateResult } from 'typeorm';
import { MajorRepository } from 'src/majors/repository/major.repository';
import * as config from 'config';
import { CategoryRepository } from 'src/categories/repository/category.repository';
import { ErrorConfirm } from 'src/utils/error';
import { School } from 'src/schools/entity/school.entity';
import { Major } from 'src/majors/entity/major.entity';
import { Category } from 'src/categories/entity/category.entity';

const jwtConfig: any = config.get('jwt');
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,

    @InjectRepository(SchoolRepository)
    private schoolRepository: SchoolRepository,

    @InjectRepository(MajorRepository)
    private majorRepository: MajorRepository,

    @InjectRepository(CategoryRepository)
    private categoriesRepository: CategoryRepository,

    private errorConfirm: ErrorConfirm,
    private jwtService: JwtService,
  ) {}
  async signUp(createUserDto: CreateUserDto): Promise<User> {
    try {
      const {
        school,
        major,
        email,
        nickname,
        categories,
        password,
      }: CreateUserDto = createUserDto;
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
      createUserDto.password = hashedPassword;
      const user: User = await this.userRepository.createUser(
        createUserDto,
        schoolRepo,
        majorRepo,
      );

      if (!user) {
        throw new NotFoundException(
          '유저 생성이 정상적으로 이루어지지 않았습니다.',
        );
      }

      const filteredCategories: Array<Category> = categoriesRepo.filter(
        (element) => element !== undefined,
      );

      for (const categoryNo of filteredCategories) {
        await this.categoriesRepository.addUser(categoryNo.no, user);
      }
      await this.schoolRepository.addUser(schoolRepo.no, user);
      await this.majorRepository.addUser(majorRepo.no, user);

      return user;
    } catch (err) {
      throw new InternalServerErrorException(
        `${err} 회원가입 도중 서비스에서 일어난 알 수 없는 오류`,
      );
    }
  }

  async signIn(signInDto: SignInDto): Promise<string> {
    try {
      const { email, password }: SignInDto = signInDto;
      const user: User = await this.userRepository.signIn(email);
      this.errorConfirm.notFoundError(
        user,
        '아이디 또는 비밀번호가 일치하지 않습니다.',
      );
      const loginTerm: number = await this.userRepository.checkLoginTerm(
        user.no,
      );

      if (user.isLock && loginTerm > 10) {
        await this.userRepository.changeIsLock(user.no, user.isLock);
      }

      const isLockUser: User = await this.userRepository.signIn(email);
      const isPassword: boolean = await bcrypt.compare(password, user.salt);

      if (!isLockUser.isLock) {
        if (user && isPassword) {
          const payload: object = {
            email,
            userNo: user.no,
            issuer: 'modern-agile',
            expiration: jwtConfig.expiresIn,
          };

          await this.userRepository.clearLoginCount(user.no);

          const accessToken: string = await this.jwtService.sign(payload);

          return accessToken;
        }
        await this.userRepository.plusLoginFailCount(isLockUser);

        const afterUser: User = await this.userRepository.signIn(email);

        if (afterUser.loginFailCount >= 5) {
          await this.userRepository.changeIsLock(
            afterUser.no,
            afterUser.isLock,
          );
        }

        throw new UnauthorizedException(
          `아이디 또는 비밀번호가 일치하지 않습니다. 로그인 실패 횟수: ${afterUser.loginFailCount} `,
        );
      }

      throw new UnauthorizedException(
        `로그인 실패 횟수를 모두 초과 하였습니다 ${Math.floor(
          10 - loginTerm,
        )}초 뒤에 다시 로그인 해주세요`,
      );
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw err;
    }
  }
  async signDown(no: number): Promise<void> {
    try {
      const affected: number = await this.userRepository.signDown(no);

      if (!affected) {
        throw new InternalServerErrorException(
          `${no} 회원님의 회원탈퇴가 정상적으로 이루어 지지 않았습니다.`,
        );
      }
    } catch (err) {
      throw err;
    }
  }

  async changePassword(changePasswordDto: ChangePasswordDto): Promise<Number> {
    try {
      const {
        email,
        nowPassword,
        changePassword,
        confirmChangePassword,
      }: ChangePasswordDto = changePasswordDto;

      if (changePassword !== confirmChangePassword) {
        throw new UnauthorizedException(
          '새비밀번호와 새비밀번호 확인이 일치하지 않습니다',
        );
      }
      const user: User = await this.userRepository.signIn(email);
      const isPassword: boolean = await bcrypt.compare(nowPassword, user.salt);
      if (user && isPassword) {
        if (nowPassword === changePassword) {
          throw new UnauthorizedException(
            '이전의 비밀번호로는 변경하실 수 없습니다.',
          );
        }
        const salt: string = await bcrypt.genSalt();
        const hashedPassword: string = await bcrypt.hash(changePassword, salt);
        const affected: number = await this.userRepository.changePassword(
          email,
          hashedPassword,
        );
        if (affected) {
          return affected;
        }
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
  async forgetPassword(forgetPasswordDto: ForgetPasswordDto): Promise<Number> {
    try {
      const {
        email,
        changePassword,
        confirmChangePassword,
      }: ForgetPasswordDto = forgetPasswordDto;

      if (changePassword !== confirmChangePassword) {
        throw new UnauthorizedException(
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
          throw new UnauthorizedException(
            '이전 비밀번호로는 변경하실 수 없습니다.',
          );
        }
        const salt: string = await bcrypt.genSalt();
        const hashedPassword: string = await bcrypt.hash(changePassword, salt);
        const affected: number = await this.userRepository.changePassword(
          email,
          hashedPassword,
        );
        if (affected) {
          return affected;
        }
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
