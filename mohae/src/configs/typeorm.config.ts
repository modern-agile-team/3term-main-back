import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';

const dbConfig = config.get('db');

const { DB_HOST, DB_PORT, DB_USER, DB_PSWORD, DB_DATABASE } = process.env;

export const typeORMConfig: TypeOrmModuleOptions = {
  type: dbConfig.type,
  host: DB_HOST || dbConfig.host,
  port: DB_PORT || dbConfig.port,
  username: DB_USER || dbConfig.username,
  password: DB_PSWORD || dbConfig.password,
  database: DB_DATABASE || dbConfig.database,
  entities: [__dirname + '/../**/*.entity.ts'],
  synchronize: dbConfig.synchronize,
};
