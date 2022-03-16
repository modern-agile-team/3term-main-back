import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, SignInDto } from './dto/auth-credential.dto';
import { UserRepository } from './repository/user.repository';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from './entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}
  async signUp(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.createUser(createUserDto);
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
}
