import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

const { DB_HOST, DB_DATABASE, DB_USER, DB_PSWORD, DB_PORT } = process.env;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: DB_HOST,
      port: Number(DB_PORT),
      username: DB_USER,
      password: DB_PSWORD,
      database: DB_DATABASE,
      entities: [],
      synchronize: true, // 개발 모드일 때만 사용
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
