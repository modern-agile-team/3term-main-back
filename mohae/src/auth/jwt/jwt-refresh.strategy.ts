import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService, UserPayload } from '../auth.service';

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
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(jwtFromRequest: UserPayload) {
    try {
      const user: UserPayload = jwtFromRequest;

      if (user.token === 'accessToken') {
        return jwtFromRequest;
      }
      if (user.token === 'refreshToken') {
        await this.authService.createAccessToken(user);
      }
    } catch (err) {
      throw err;
    }
  }
}
