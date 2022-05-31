import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserRepository } from 'src/auth/repository/user.repository';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  exports: [],
})
export class TermsModule {}
