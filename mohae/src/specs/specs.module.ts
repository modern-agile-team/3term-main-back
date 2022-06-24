import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserRepository } from 'src/auth/repository/user.repository';
import { PhotoModule } from 'src/photo/photo.module';
import { SpecPhotoRepository } from 'src/photo/repository/photo.repository';
import { ErrorConfirm } from 'src/common/utils/error';
import { SpecRepository } from './repository/spec.repository';
import { SpecsController } from './specs.controller';
import { SpecsService } from './specs.service';
import { AwsService } from 'src/aws/aws.service';
import { cacheModule } from 'src/common/configs/redis.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    cacheModule,
    ConfigModule,
    TypeOrmModule.forFeature([
      UserRepository,
      SpecRepository,
      SpecPhotoRepository,
    ]),
    AuthModule,
    PhotoModule,
  ],
  controllers: [SpecsController],
  providers: [SpecsService, AwsService, ErrorConfirm],
})
export class SpecsModule {}
