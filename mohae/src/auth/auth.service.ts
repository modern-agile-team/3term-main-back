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
import { School } from 'src/schools/entity/school.entity';
import { CategoryRepository } from 'src/categories/repository/category.repository';
import { Category } from 'src/categories/entity/category.entity';

const jwtConfig = config.get('jwt');
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private schoolRepository: SchoolRepository,
    private majorRepository: MajorRepository,
    private categoriesRepository: CategoryRepository,
  ) {}
  async signUp(createUserDto: CreateUserDto): Promise<User> {
    const { school, major, email, nickname, categories } = createUserDto;

    const schoolRepo = await this.schoolRepository.findOne(school, {
      relations: ['users'],
    });
    const majorRepo = await this.majorRepository.findOne(major, {
      relations: ['users'],
    });
    const categoriesRepo = await this.categoriesRepository.selectCategory(
      categories,
    );

    const stringEmail = 'email';
    const stringNickname = 'nickname';

    const duplicateEmail = await this.userRepository.duplicateCheck(
      stringEmail,
      email,
    );
    const duplicateNickname = await this.userRepository.duplicateCheck(
      stringNickname,
      nickname,
    );
    const duplicateObj = { 이메일: duplicateEmail, 닉네임: duplicateNickname };
    const duplicateKeys = Object.keys(duplicateObj).filter((key) => {
      if (duplicateObj[key]) return true;
      return false;
    });
    if (duplicateKeys.length) {
      throw new ConflictException(`해당 ${duplicateKeys}이 이미 존재합니다.`);
    }

    const user = await this.userRepository.createUser(
      createUserDto,
      schoolRepo,
      majorRepo,
    );
    const userCategory = await this.userRepository.findOne(user.no, {
      relations: ['categories'],
    });

    for (const i of categoriesRepo) {
      if (!i) {
        continue;
      }
      userCategory.categories.push(i);
    }

    schoolRepo.users.push(user);
    majorRepo.users.push(user);

    await this.categoriesRepository.saveUsers(categoriesRepo, userCategory);

    return user;
  }
  async signIn(signInDto: SignInDto): Promise<{ accessToken: string }> {
    try {
      const { email, password } = signInDto;
      const user = await this.userRepository.signIn(email);
      if (user && (await bcrypt.compare(password, user.salt))) {
        const payload = {
          email,
          issuer: 'modern-agile',
          expiration: jwtConfig.expiresIn,
        };
        const accessToken = await this.jwtService.sign(payload);

        return { accessToken };
      } else {
        throw new UnauthorizedException(
          '아이디 또는 비밀번호가 일치하지 않습니다.',
        );
      }
    } catch (e) {
      throw e;
    }
  }
  async signDown(no: number): Promise<DeleteResult> {
    const result = await this.userRepository.signDown(no);

    if (result.affected === 0) {
      throw new NotFoundException(
        `${no} 회원님의 회원탈퇴가 정상적으로 이루어 지지 않았습니다.`,
      );
    } else if (result.affected === 1) {
      return result;
    }
  }
}
