import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  CacheInterceptor,
  CacheModule,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmConfig } from './common/configs/typeorm.config';
import { ReportsModule } from './reports/reports.module';
import { FaqsModule } from './faqs/faqs.module';
import { CategoriesModule } from './categories/categories.module';
import { BoardsModule } from './boards/boards.module';
import { AreasModule } from './areas/areas.module';
import { ReviewsModule } from './reviews/reviews.module';
import { SchoolsModule } from './schools/schools.module';
import { MajorsModule } from './majors/majors.module';
import { AuthModule } from './auth/auth.module';
import { ProfilesModule } from './profiles/profiles.module';
import { NotesModule } from './notes/notes.module';
import { LettersModule } from './letters/letters.module';
import { MailboxesModule } from './mailboxes/mailboxes.module';
import { EmailModule } from './email/email.module';
import { NoticesModule } from './notices/notices.module';
import { SpecsModule } from './specs/specs.module';
import { PhotoModule } from './photo/photo.module';
import { LikeModule } from './like/like.module';
import { RedisCacheModule } from './redis-cache/redis-cache.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MailboxUserModule } from './mailbox-user/mailbox-user.module';
import { AwsService } from './aws/aws.service';
import { TermsModule } from './terms/terms.module';
import { BasketsModule } from './baskets/baskets.module';
import { ReportChecksModule } from './report-checks/report-checks.module';
import { ReportCheckboxesModule } from './report-checkboxes/report-checkboxes.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { WinstonModule } from 'nest-winston';
import { envConfig } from './common/configs/env.config';
import { winstonConfig } from './common/configs/winston.config';
import { CommentsModule } from './comments/comments.module';
import { RepliesModule } from './replies/replies.module';

@Module({
  imports: [
    ConfigModule.forRoot(envConfig),
    TypeOrmModule.forRootAsync(typeOrmConfig),
    WinstonModule.forRootAsync(winstonConfig),
    ReportsModule,
    FaqsModule,
    CategoriesModule,
    BoardsModule,
    AreasModule,
    ReviewsModule,
    SchoolsModule,
    MajorsModule,
    AuthModule,
    ProfilesModule,
    NotesModule,
    LettersModule,
    MailboxesModule,
    EmailModule,
    NoticesModule,
    SpecsModule,
    PhotoModule,
    LikeModule,
    TermsModule,
    CacheModule.register({
      //   isGlobal: true,
      //   store: redisStore,
      //   socket: {
      //     host: 'localhost',
      //     port: 6379,
      //   },
    }),
    RedisCacheModule,
    MailboxUserModule,
    BasketsModule,
    ReportChecksModule,
    ReportCheckboxesModule,
    CommentsModule,
    RepliesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    ConfigService,
    AwsService,
  ],
  exports: [ConfigService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
