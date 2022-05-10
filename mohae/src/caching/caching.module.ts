import { Module } from '@nestjs/common';
import { CachingController } from './caching.controller';
import { CachingService } from './caching.service';

@Module({
  controllers: [CachingController],
  providers: [CachingService]
})
export class CachingModule {}
