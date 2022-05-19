import {
  CacheInterceptor,
  CacheKey,
  CacheTTL,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation } from '@nestjs/swagger';
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

  @ApiOperation({ summary: '이미지 업로드' })
  @UseInterceptors(FileInterceptor('image'))
  @Post('/upload')
  async uploadImg(@UploadedFile() file: Express.Multer.File) {
    return await this.awsService.uploadFileToS3('profiles', file);
  }
}
