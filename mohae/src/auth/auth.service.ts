import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, SignInDto } from './dto/auth-credential.dto';
import { UserRepository } from './repository/user.repository';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from './entity/user.entity';
import { SchoolRepository } from 'src/schools/repository/school.repository';
import { DeleteResult } from 'typeorm';
import { MajorRepository } from 'src/majors/repository/major.repository';
import * as config from 'config';
import { CategoryRepository } from 'src/categories/repository/category.repository';
import { ErrorConfirm } from 'src/utils/error';

const jwtConfig = config.get('jwt');
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
    const { school, major, email, nickname, categories } = createUserDto;

    const schoolRepo = await this.schoolRepository.findOne(school, {
      relations: ['users'],
    });
    const majorRepo = await this.majorRepository.findOne(major, {
      relations: ['users'],
    });
    if (!schoolRepo || !majorRepo) {
      const notFoundObj = { 학교: schoolRepo, 전공: majorRepo };
      const notFoundKey = Object.keys(notFoundObj).filter(
        (key) => !notFoundObj[key],
      );
      if (notFoundKey.length) {
        throw new NotFoundException(
          `해당 번호에 해당하는 ${notFoundKey}이(가) 존재하지 않습니다.`,
        );
      }
    }

    const categoriesRepo = await this.categoriesRepository.selectCategory(
      categories,
    );
    const duplicateEmail = await this.userRepository.duplicateCheck(
      'email',
      email,
    );

    const duplicateNickname = await this.userRepository.duplicateCheck(
      'nickname',
      nickname,
    );
    const duplicateObj = { 이메일: duplicateEmail, 닉네임: duplicateNickname };
    const duplicateKeys = Object.keys(duplicateObj).filter(
      (key) => duplicateObj[key],
    );

    if (duplicateKeys.length) {
      throw new ConflictException(`해당 ${duplicateKeys}이 이미 존재합니다.`);
    }

    const user = await this.userRepository.createUser(
      createUserDto,
      schoolRepo,
      majorRepo,
    );
    if (!user) {
      throw new NotFoundException(
        '유저 생성이 정상적으로 이루어지지 않았습니다.',
      );
    }
    const userCategory = await this.userRepository.findOne(user.no, {
      relations: ['categories'],
    });

    const filteredCategories = categoriesRepo.filter(
      (element) => element !== undefined,
    );
    userCategory.categories.push(...filteredCategories);

    schoolRepo.users.push(user);
    majorRepo.users.push(user);

    await this.categoriesRepository.saveUsers(filteredCategories, userCategory);

    return user;
  }

  async signIn(signInDto: SignInDto): Promise<{ accessToken: string }> {
    try {
      const { email, password } = signInDto;
      const user = await this.userRepository.signIn(email);

      this.errorConfirm.notFoundError(
        user,
        '아이디 또는 비밀번호가 일치하지 않습니다.',
      );

      const lastLogin = user.latestLogin.getTime();

      // VScode에서 찍는 현재시간이 pc 시간보다 9시간 적게 나와서 일단 Date().getTime()에 9시간을 강제로 더해서 현재시간을 측정해주었음
      // const plusCurrentTime = 9 * 60 * 60 * 1000;
      const plusCurrentTime = 32398362;
      const currentTime = new Date().getTime() + plusCurrentTime;

      if (user.isLock && currentTime >= lastLogin + 10000) {
        await this.userRepository.changeIsLock(user.no, user.isLock);
      }
      const isLockUser = await this.userRepository.signIn(email);
      const isPassword = await bcrypt.compare(password, user.salt);
      if (!isLockUser.isLock) {
        if (user && isPassword) {
          const payload = {
            email,
            issuer: 'modern-agile',
            expiration: jwtConfig.expiresIn,
          };

          await this.userRepository.clearLoginCount(user.no);

          const accessToken = await this.jwtService.sign(payload);

          return { accessToken };
        }

        await this.userRepository.plusLoginFailCount(isLockUser);
        const afterUser = await this.userRepository.signIn(email);

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
          (lastLogin + 10000 - currentTime) / 1000,
        )}초 뒤에 다시 로그인 해주세요`,
      );
    } catch (e) {
      throw e;
    }
  }
  async signDown(no: number): Promise<DeleteResult> {
    const result = await this.userRepository.signDown(no);

    if (!result.affected) {
      throw new NotFoundException(
        `${no} 회원님의 회원탈퇴가 정상적으로 이루어 지지 않았습니다.`,
      );
    }
    return result;
  }

  async changePassword(changePasswordDto) {
    try {
      const { email, nowPassword, changePassword, confirmChangePassword } =
        changePasswordDto;

      if (changePassword !== confirmChangePassword) {
        throw new UnauthorizedException(
          '새비밀번호화 새비밀번호 확인이 일치하지 않습니다',
        );
      }
      const user = await this.userRepository.signIn(email);
      const isPassword = await bcrypt.compare(nowPassword, user.salt);
      if (user && isPassword) {
        if (nowPassword === changePassword) {
          throw new UnauthorizedException(
            '이전의 비밀번호로는 변경하실 수 없습니다.',
          );
        }
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(changePassword, salt);
        const result = await this.userRepository.changePassword(
          email,
          hashedPassword,
        );

        if (result.affected) {
          return result;
        }
        throw new Error('비밀번호 변경중 알 수 없는 오류입니다.');
      }
      throw new UnauthorizedException(
        '아이디 또는 비밀번호가 일치하지 않습니다.',
      );
    } catch (e) {
      throw e;
    }
  }
  async forgetPassword(forgetPasswordDto) {
    try {
      const { email, changePassword, confirmChangePassword } =
        forgetPasswordDto;

      if (changePassword !== confirmChangePassword) {
        throw new UnauthorizedException(
          '새비밀번호화 새비밀번호 확인이 일치하지 않습니다',
        );
      }
      const user = await this.userRepository.signIn(email);

      if (user) {
        const isPassword = await bcrypt.compare(changePassword, user.salt);

        if (isPassword) {
          throw new UnauthorizedException(
            '이전 비밀번호로는 변경하실 수 없습니다.',
          );
        }
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(changePassword, salt);
        const result = await this.userRepository.changePassword(
          email,
          hashedPassword,
        );

        if (result.affected) {
          return result;
        }
        throw new UnauthorizedException(
          '비밀번호 변경 중 알 수 없는 오류입니다.',
        );
      }
      throw new UnauthorizedException('존재하지 않는 이메일 입니다.');
    } catch (e) {
      throw e;
    }
  }
}
