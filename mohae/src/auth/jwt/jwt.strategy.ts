import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { UserRepository } from '../repository/user.repository';
import { Strategy, ExtractJwt } from 'passport-jwt';
import * as config from 'config';

const { secret } = config.get('jwt');

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
    super({
      secretOrKey: secret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload) {
    const { email } = payload;
    const user: User = await this.userRepository.signIn(email);

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
