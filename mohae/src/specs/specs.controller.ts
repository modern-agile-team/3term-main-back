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
  Query,
  Put,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '@sentry/node';
import { create } from 'domain';
import { AwsService } from 'src/aws/aws.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { SuccesseInterceptor } from 'src/common/interceptors/success.interceptor';
import { CreateSpecDto } from './dto/create-spec.dto';
import { UpdateSpecDto } from './dto/update-spec.dto';
import { Spec } from './entity/spec.entity';
import { SpecsService } from './specs.service';

@Controller('specs')
@UseInterceptors(SuccesseInterceptor)
@ApiTags('스펙 API')
export class SpecsController {
  constructor(
    private readonly specsService: SpecsService,

    private readonly awsService: AwsService,
  ) {}

  @Get('user/:profileUserNo')
  @HttpCode(200)
  @ApiOperation({
    summary: '한 명의 유저 스펙 전체 조회 API',
    description: '한명의 유저 스펙을 한번에 불러온다',
  })
  @ApiOkResponse({
    description: '성공적으로 유저의 스펙이 불러와진 경우.',
  })
  @ApiInternalServerErrorResponse({
    description: '스펙 전체 조회 관련 서버 에러.',
  })
  async getAllSpec(
    @Param('profileUserNo') profileUserNo: number,
  ): Promise<object> {
    const response: Spec = await this.specsService.getAllSpec(profileUserNo);

    return {
      msg: '성공적으로 스펙을 불러왔습니다.',
      response,
    };
  }

  @Get('spec/:specNo')
  @HttpCode(200)
  @ApiOperation({
    summary: '스펙 상세조회 API',
    description: '하나의 스펙을 조회 해준다.',
  })
  @ApiOkResponse({
    description: '성공적으로 스펙이 불러와진 경우.',
  })
  @ApiResponse({ status: 404, description: '해당 스펙이 존재하지 않은 경우' })
  async getOneSpec(@Param('specNo') specNo: number): Promise<object> {
    const response: Spec = await this.specsService.getOneSpec(specNo);

    return {
      msg: '성공적으로 스펙을 불러왔습니다.',
      response,
    };
  }

  @Get('profile')
  @HttpCode(200)
  @ApiOkResponse({
    description: '성공적으로 스펙 조회가 된경우 불러와진 경우.',
  })
  async readUserSpec(
    @Query('user') user: number,
    @Query('take') take: number,
    @Query('page') page: number,
  ): Promise<object> {
    const response: Spec[] = await this.specsService.readUserSpec(
      user,
      take,
      page,
    );
    return {
      msg: '프로필 스펙 조회에 성공했습니다.',
      response,
    };
  }

  @Post('regist')
  @UseInterceptors(FilesInterceptor('image', 10))
  @HttpCode(201)
  @ApiOperation({
    summary: '스펙 등록 API',
    description: '스펙을 등록한다',
  })
  @ApiOkResponse({
    description: '성공적으로 스펙이 등록된 경우.',
  })
  @ApiInternalServerErrorResponse({
    description: '스펙 사진 등록이 제대로 이루어지지 않은 경우',
  })
  @UseGuards(AuthGuard())
  async registSpec(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createSpecDto: CreateSpecDto,
    @CurrentUser() user: User,
  ): Promise<object> {
    if (!files.length)
      throw new BadRequestException(
        '사진을 선택하지 않은 경우 기본사진을 넣어주셔야 스펙 등록이 가능 합니다.',
      );

    const specPhotoUrls = await this.awsService.uploadSpecFileToS3(
      'spec',
      files,
    );

    await this.specsService.registSpec(user.no, specPhotoUrls, createSpecDto);

    return {
      msg: '성공적으로 스팩등록이 되었습니다.',
    };
  }

  @Put(':no')
  @UseInterceptors(FilesInterceptor('image', 10))
  @HttpCode(200)
  @ApiOperation({
    summary: '스펙 수정 API',
    description: '스펙을 수정한다',
  })
  @ApiOkResponse({
    description: '성공적으로 스펙이 수정 경우.',
  })
  @ApiResponse({
    status: 404,
    description: '스펙이 존재하지 않은 경우',
  })
  async updateSpec(
    @Param('no') specNo: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() updateSpecdto: UpdateSpecDto,
  ): Promise<object> {
    const specPhotoUrls =
      files.length === 0
        ? false
        : await this.awsService.uploadSpecFileToS3('spec', files);

    const originSpecPhotoUrls = await this.specsService.updateSpec(
      specNo,
      updateSpecdto,
      specPhotoUrls,
    );

    await this.awsService.deleteSpecS3Object(originSpecPhotoUrls);

    return {
      msg: '성공적으로 스팩이 수정되었습니다.',
    };
  }

  @Delete(':no')
  @HttpCode(200)
  @ApiOperation({
    summary: '스펙 삭제 API',
    description: '스펙을 삭제한다',
  })
  @ApiOkResponse({
    description: '성공적으로 스펙이 삭제된 경우.',
  })
  async deleteSpec(@Param('no') specNo: number): Promise<object> {
    await this.specsService.deleteSpec(specNo);

    return {
      msg: '성공적으로 스팩을 삭제하였습니다.',
    };
  }
}
