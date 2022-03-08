import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeORMConfig } from './configs/typeorm.config';
import { ReportsModule } from './reports/reports.module';
import { FaqsModule } from './faqs/faqs.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeORMConfig), ReportsModule, FaqsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
