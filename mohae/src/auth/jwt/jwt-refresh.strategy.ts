import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService, UserPayload } from '../auth.service';
import { User } from '../entity/user.entity';
import { UserRepository } from '../repository/user.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private readonly authService: AuthService,
    public readonly configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get<string>('JWT_SECRET'),
      ignoreExpiration: true,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(jwtFromRequest: UserPayload) {
    try {
      const user: UserPayload = jwtFromRequest;

      if (user.token === 'accessToken') {
        const user: User = await this.authService.validateAccessToken(
          jwtFromRequest,
        );

        return user;
      }
      if (user.token === 'refreshToken') {
        await this.authService.createAccessToken(user);
      }
    } catch (err) {
      throw err;
    }
  }
}
