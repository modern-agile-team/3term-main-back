import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateUserDto,
  SignDownDto,
  SignInDto,
} from './dto/auth-credential.dto';
import { UserRepository } from './repository/user.repository';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from './entity/user.entity';
import { SchoolRepository } from 'src/schools/repository/school.repository';
import { DeleteResult } from 'typeorm';
import { MajorRepository } from 'src/majors/repository/major.repository';
import { isEmail } from 'class-validator';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private schoolRepository: SchoolRepository,
    private majorRepository: MajorRepository,
  ) {}
  async signUp(createUserDto: CreateUserDto): Promise<User> {
    const { school, major, email, nickname } = createUserDto;

    const schoolRepo = await this.schoolRepository.findOne(school, {
      relations: ['users'],
    });
    const majorRepo = await this.majorRepository.findOne(major, {
      relations: ['users'],
    });

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

    schoolRepo.users.push(user);
    majorRepo.users.push(user);

    return user;
  }

  async signIn(signInDto: SignInDto): Promise<{ accessToken: string }> {
    try {
      const { email, password } = signInDto;
      const user = await this.userRepository.signIn(email);
      const isPassword = await bcrypt.compare(password, user.salt);
      console.log(isPassword);
      const judgeSignInObj = { user, isPassword };
      // const judgeSignInKeys = Object.keys(judgeSignInObj).filter((key) => {
      //   if (judgeSignInObj[key]) return true
      //   return false
      // })

      if (user && isPassword) {
        const payload = { email };
        const accessToken = await this.jwtService.sign(payload);

        return { accessToken };
      } else {
        throw new UnauthorizedException('로그인 실패');
      }
    } catch (e) {
      console.log(e);
    }
  }
  async signDown(no: number): Promise<DeleteResult> {
    const result = await this.userRepository.deleteUser(no);

    if (result.affected === 0) {
      throw new NotFoundException(
        `${no} 회원님의 회원탈퇴가 정상적으로 이루어 지지 않았습니다.`,
      );
    } else if (result.affected === 1) {
      return result;
    }
  }
}
