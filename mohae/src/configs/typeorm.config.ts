import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const { DB_HOST, DB_PORT, DB_USER, DB_PSWORD, DB_DATABASE } = process.env;

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_USER,
  password: DB_PSWORD,
  database: DB_DATABASE,
  entities: [],
  synchronize: true,
};
