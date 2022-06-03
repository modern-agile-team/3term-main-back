import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModuleAsyncOptions } from 'nest-winston';
import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

export const winstonConfig: WinstonModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    transports: [
      new winston.transports.Console({
        level:
          configService.get<string>('NODE_ENV') === 'production'
            ? 'info'
            : 'silly',
        format: winston.format.combine(
          winston.format.timestamp(),
          nestWinstonModuleUtilities.format.nestLike('MOHAE', {
            prettyPrint: true,
          }),
        ),
      }),
    ],
  }),
};
