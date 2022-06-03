import { ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions } from '@nestjs/jwt';

export const jwtConfig: JwtModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (configServcie: ConfigService) => ({
    secret: configServcie.get<string>('JWT_SECRET'),
    signOptions: {
      expiresIn: configServcie.get<number>('EXPIRES_IN'),
    },
  }),
};
