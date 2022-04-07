import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';
import { Area } from 'src/areas/entity/areas.entity';
import { User } from 'src/auth/entity/user.entity';
import { Board } from 'src/boards/entity/board.entity';
import { Category } from 'src/categories/entity/category.entity';
import { Faq } from 'src/faqs/entity/faq.entity';
import { Major } from 'src/majors/entity/major.entity';
import {
  ReportCheckBox,
  ReportContent,
  ReportedBoard,
  ReportedUser,
} from 'src/reports/entity/report.entity';
import { Review } from 'src/reviews/entity/review.entity';
import { School } from 'src/schools/entity/school.entity';
import { Note } from 'src/notes/entity/note.entity';
import { Letter } from 'src/letters/entity/letter.entity';
import { Mailbox } from 'src/mailboxes/entity/mailbox.entity';
import { Spec } from 'src/specs/entity/spec.entity';
import { Notice } from 'src/notices/entity/notice.entity';
import { SpecPhoto } from 'src/photo/entity/photo.entity';
const dbConfig = config.get('db');

const { DB_HOST, DB_PORT, DB_USER, DB_PSWORD, DB_DATABASE } = process.env;

export const typeORMConfig: TypeOrmModuleOptions = {
  timezone: 'Z',
  type: dbConfig.type,
  host: DB_HOST || dbConfig.host,
  port: DB_PORT || dbConfig.port,
  username: DB_USER || dbConfig.username,
  password: DB_PSWORD || dbConfig.password,
  database: DB_DATABASE || dbConfig.database,
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
    ReportCheckBox,
    Review,
    School,
    Note,
    Letter,
    Mailbox,
    Spec,
    Notice,
    SpecPhoto,
  ],
  // entities: [__dirname + '/../**/*.entity.{ts,js}'],
  synchronize: dbConfig.synchronize,
  keepConnectionAlive: true,
};
