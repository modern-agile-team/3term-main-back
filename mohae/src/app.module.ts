import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeORMConfig } from './configs/typeorm.config';
<<<<<<< HEAD
import { ReportsModule } from './reports/reports.module';
import { FaqsModule } from './faqs/faqs.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeORMConfig), ReportsModule, FaqsModule, CategoriesModule],
=======

@Module({
  imports: [TypeOrmModule.forRoot(typeORMConfig)],
>>>>>>> cb50d5df1c24fb0d5587411120777e2bdcffab98
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
