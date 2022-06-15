import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { Area } from 'src/areas/entity/areas.entity';
import { User } from 'src/auth/entity/user.entity';
import { Board } from 'src/boards/entity/board.entity';
import { Category } from 'src/categories/entity/category.entity';
import { Faq } from 'src/faqs/entity/faq.entity';
import { Major } from 'src/majors/entity/major.entity';
import { Review } from 'src/reviews/entity/review.entity';
import { School } from 'src/schools/entity/school.entity';
import { Note } from 'src/notes/entity/note.entity';
import { Letter } from 'src/letters/entity/letter.entity';
import { Mailbox } from 'src/mailboxes/entity/mailbox.entity';
import { Spec } from 'src/specs/entity/spec.entity';
import { Notice } from 'src/notices/entity/notice.entity';
import { SpecPhoto } from 'src/photo/entity/spec.photo.entity';
import { UserLike } from 'src/like/entity/user.like.entity';
import { UserReportChecks } from 'src/report-checks/entity/user-report-checks.entity';
import { BoardLike } from 'src/like/entity/board.like.entity';
import { BoardPhoto } from 'src/photo/entity/board.photo.entity';
import { MailboxUser } from 'src/mailbox-user/entity/mailbox-user.entity';
import { Terms, TermsUser } from 'src/terms/entity/terms.entity';
import { Basket } from 'src/baskets/entity/baskets.entity';
import { ReportCheckbox } from 'src/report-checkboxes/entity/report-checkboxes.entity';
import { BoardReportChecks } from 'src/report-checks/entity/board-report-checks.entity';
import { ReportContent } from 'src/reports/entity/report-base.entity';
import { ReportedUser } from 'src/reports/entity/reported-user.entity';
import { ReportedBoard } from 'src/reports/entity/reported-board.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProfilePhoto } from 'src/photo/entity/profile.photo.entity';
import { Comment } from 'src/comments/entity/comment.entity';

export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'mysql',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_DATABASE'),
    synchronize: configService.get<boolean>('DB_SYNCHRONIZE'),
    logging: configService.get<boolean>('DB_LOGGING'),
    entities: [
      Area,
      User,
      Board,
      Category,
      Faq,
      Major,
      ReportContent,
      ReportedUser,
      ReportedBoard,
      ReportCheckbox,
      Review,
      School,
      Note,
      Letter,
      Mailbox,
      Spec,
      Notice,
      SpecPhoto,
      UserLike,
      BoardReportChecks,
      UserReportChecks,
      MailboxUser,
      BoardLike,
      BoardPhoto,
      Terms,
      TermsUser,
      Basket,
      ProfilePhoto,
      Comment,
    ],
  }),
};
