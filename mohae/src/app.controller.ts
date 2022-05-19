import {
  CacheInterceptor,
  CacheKey,
  CacheTTL,
  Controller,
  Get,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AwsService } from './aws/aws.service';

// @UseInterceptors(CacheInterceptor)
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly awsService: AwsService,
  ) {}

  // @Get()
  // @CacheKey('')
  // @CacheTTL(60)
  // async getHello() {
  //   return await this.appService.getHello();
  // }
}
