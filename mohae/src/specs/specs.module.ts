import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserRepository } from 'src/auth/repository/user.repository';
import { PhotoModule } from 'src/photo/photo.module';
import { SpecPhotoRepository } from 'src/photo/repository/photo.repository';
import { SpecRepository } from './repository/spec.repository';
import { SpecsController } from './specs.controller';
import { SpecsService } from './specs.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      SpecRepository,
      SpecPhotoRepository,
    ]),
    AuthModule,
    PhotoModule,
  ],
  controllers: [SpecsController],
  providers: [SpecsService],
})
export class SpecsModule {}
