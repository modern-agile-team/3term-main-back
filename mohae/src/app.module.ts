import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeORMConfig } from './configs/typeorm.config';
import { ReportsModule } from './reports/reports.module';
import { FaqsModule } from './faqs/faqs.module';
import { CategoriesModule } from './categories/categories.module';
import { BoardsModule } from './boards/boards.module';
import { CitiesModule } from './cities/cities.module';
import { WardsModule } from './wards/wards.module';
import { AreasModule } from './areas/areas.module';
import { ReviewsModule } from './reviews/reviews.module';
import { SchoolsModule } from './schools/schools.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    ReportsModule,
    FaqsModule,
    CategoriesModule,
    BoardsModule,
    CitiesModule,
    WardsModule,
    AreasModule,
    ReviewsModule,
    SchoolsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
