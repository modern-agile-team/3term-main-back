import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@sentry/node';
import { AwsService } from 'src/aws/aws.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CreateSpecDto, UpdateSpecDto } from './dto/spec.dto';
import { Spec } from './entity/spec.entity';
import { SpecsService } from './specs.service';

@Controller('specs')
@ApiTags('스펙 API')
export class SpecsController {
  constructor(
    private specsService: SpecsService,

    private awsService: AwsService,
  ) {}

  @Get('/user/:no')
  @ApiOperation({
    summary: '한 명의 유저 스펙 전체 조회 API',
    description: '한명의 유저 스펙 한번에 불러온다',
  })
  async getAllSpec(@Param('no') no: number) {
    try {
      const specs: Spec = await this.specsService.getAllSpec(no);

      return Object.assign({
        statusCode: 200,
        msg: '성공적으로 스펙을 불러왔습니다.',
        specs,
      });
    } catch (err) {
      throw err;
    }
  }

  @Get('/user/spec/:no')
  async getOneSpec(@Param('no') no: number) {
    try {
      const spec: Spec = await this.specsService.getOneSpec(no);

      return Object.assign({
        statusCode: 200,
        msg: '성공적으로 스펙을 불러왔습니다.',
        spec,
      });
    } catch (err) {
      throw err;
    }
  }

  @UseInterceptors(FilesInterceptor('image', 10))
  @Post('/regist')
  @UseGuards(AuthGuard())
  async registSpec(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() createSpecDto: CreateSpecDto,
    @CurrentUser() user: User,
  ) {
    try {
      const specPhotoUrls =
        files[0].originalname === 'default.jpg'
          ? ['default.jpg']
          : await this.awsService.uploadSpecFileToS3('spec', files);

      await this.specsService.registSpec(user.no, specPhotoUrls, createSpecDto);

      return Object.assign({
        statusCode: 201,
        msg: '성공적으로 스팩등록이 되었습니다.',
      });
    } catch (err) {
      throw err;
    }
  }

  @Patch('/:no')
  async updateSpec(
    @Param('no') specNo: number,
    @Body() updateSpec: UpdateSpecDto,
  ) {
    try {
      await this.specsService.updateSpec(specNo, updateSpec);

      return Object.assign({
        statusCode: 204,
        msg: '성공적으로 스팩이 수정되었습니다.',
      });
    } catch (err) {
      throw err;
    }
  }

  @Delete('/:no')
  async deleteSpec(@Param('no') specNo: number) {
    try {
      await this.specsService.deleteSpec(specNo);

      return Object.assign({
        statusCode: 204,
        msg: '성공적으로 스팩을 삭제하였습니다.',
      });
    } catch (err) {
      throw err;
    }
  }
}
