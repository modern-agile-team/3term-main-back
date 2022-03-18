import {
  Injectable,
  InternalServerErrorException,
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
import { throws } from 'assert';
import { CreateReviewDto } from 'src/reviews/dto/create-review.dto';
import { School } from 'src/schools/entity/school.entity';
import { DeleteResult } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private schoolRepository: SchoolRepository,
  ) {}
  async signUp(createUserDto: CreateUserDto): Promise<User> {
    const { school } = createUserDto;
    const schoolRepo = await this.schoolRepository.findOne(school);
    // console.log(typeof schoolRepo.users);
    const user = await this.userRepository.createUser(createUserDto);

    if (user) {
      // schoolRepo.users.push(user);
      return user;
    } else {
      throw new InternalServerErrorException(
        '서버에러입니다 서버 담당장에게 말해주세요',
      );
    }
  }

  async signIn(signInDto: SignInDto): Promise<{ accessToken: string }> {
    try {
      const { email, password } = signInDto;
      const user = await this.userRepository.findOne({ email });
      if (user && (await bcrypt.compare(password, user.salt))) {
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
    try {
      const result = await this.userRepository
        .createQueryBuilder()
        .delete()
        .from(User)
        .where('no = :no', { no })
        .execute();

      if (result.affected === 0) {
        throw new NotFoundException(
          `${no} 회원님의 회원탈퇴가 정상적으로 이루어 지지 않았습니다.`,
        );
      } else if (result.affected === 1) {
        return result;
      }
    } catch (e) {
      console.log(e);
    }
  }
}
