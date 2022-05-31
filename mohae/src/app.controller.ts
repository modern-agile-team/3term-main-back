import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { AwsService } from './aws/aws.service';
import { multerOptions } from './common/configs/multer.option';

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

  @Post('image')
  @UseInterceptors(FilesInterceptor('image', 10, multerOptions))
  async imageResizing(@UploadedFiles() files: Express.Multer.File) {
    const savedImage = await this.awsService.uploadFileToS3('resize', files);

    return savedImage;
  }
}
