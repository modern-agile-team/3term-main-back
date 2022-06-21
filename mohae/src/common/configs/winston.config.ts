import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  WinstonModuleAsyncOptions,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import * as winston from 'winston';
import * as winstonDaily from 'winston-daily-rotate-file';

const logDir = 'logs';

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
      // verbose 레벨 로그를 저장할 파일 설정
      new winstonDaily({
        level: 'verbose',
        datePattern: 'YYYY-MM-DD',
        dirname: logDir,
        filename: `%DATE%.log`,
        maxFiles: 30, // 30일치 로그 파일 저장
        zippedArchive: true,
      }),
      // error 레벨 로그를 저장할 파일 설정
      new winstonDaily({
        level: 'error',
        datePattern: 'YYYY-MM-DD',
        dirname: logDir + '/errors', // error.log 파일은 /logs/errors 하위에 저장
        filename: `%DATE%.error.log`,
        maxFiles: 30,
        zippedArchive: true,
      }),
    ],
  }),
};
