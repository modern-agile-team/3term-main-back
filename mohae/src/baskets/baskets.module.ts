import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/repository/user.repository';
import { BoardRepository } from 'src/boards/repository/board.repository';
import { ErrorConfirm } from 'src/common/utils/error';
import { BasketsController } from './baskets.controller';
import { BasketsService } from './baskets.service';
import { BasketRepository } from './repository/baskets.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BasketRepository,
      UserRepository,
      BoardRepository,
    ]),
  ],
  controllers: [BasketsController],
  providers: [BasketsService, ErrorConfirm],
})
export class BasketsModule {}
