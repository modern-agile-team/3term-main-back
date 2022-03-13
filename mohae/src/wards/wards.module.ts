import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WardsRepository } from './repository/ward.repository';
import { WardsController } from './wards.controller';
import { WardsService } from './wards.service';

@Module({
  imports: [TypeOrmModule.forFeature([WardsRepository])],
  controllers: [WardsController],
  providers: [WardsService],
})
export class WardsModule {}
