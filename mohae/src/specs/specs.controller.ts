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
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '@sentry/node';
import { AwsService } from 'src/aws/aws.service';
import { HTTP_STATUS_CODE } from 'src/common/configs/http-status.config';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CreateSpecDto } from './dto/create-spec.dto';
import { UpdateSpecDto } from './dto/update-spec.dto';
import { Spec } from './entity/spec.entity';
import { OneSpec, SpecsService } from './specs.service';

@ApiTags('스펙 API')
@UseGuards(AuthGuard('jwt'))
@Controller('specs')
export class SpecsController {
  constructor(
    private readonly specsService: SpecsService,
    private readonly awsService: AwsService,
  ) {}

  @ApiOperation({
    summary: '스펙 상세조회 API',
    description: '하나의 스펙을 불러와 줍니다.',
  })
  @ApiOkResponse({
    description: '성공적으로 스펙이 불러와진 경우.',
    schema: {
      example: {
        statusCode: 200,
        msg: '성공적으로 스펙을 불러왔습니다.',
      },
    },
  })
  @ApiNotFoundResponse({
    description: '찾으려는 스펙이 DB에 존재하지 않는 경우',
    schema: {
      example: {
        statusCode: 404,
        msg: '해당 스펙이 존재하지 않습니다.',
        err: 'Not Found',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: '요청에 대한 응답 처리중 서버에러가 발생한 경우',
    schema: {
      example: {
        statusCode: 500,
        msg: 'DB관련한 에러 메시지 + ~에서 일어난 에러입니다.',
        err: 'InternalServerErrorException',
      },
    },
  })
  @HttpCode(HTTP_STATUS_CODE.success.ok)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Get('spec/:specNo')
  async getOneSpec(@Param('specNo') specNo: number): Promise<object> {
    const response: OneSpec = await this.specsService.getOneSpec(specNo);

    return {
      msg: '성공적으로 스펙을 불러왔습니다.',
      response,
    };
  }

  @ApiOperation({
    summary: '프로필 페이지 스펙 불러오는 API',
    description: '프로필 페이지에서 스펙을 조회할 때 사용되는 api입니다.',
  })
  @ApiOkResponse({
    description: '성공적으로 스펙 조회가 된경우 불러와진 경우.',
    schema: {
      example: {
        statusCode: 200,
        msg: '프로필 스펙 조회에 성공했습니다.',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: '요청에 대한 응답 처리중 서버에러가 발생한 경우',
    schema: {
      example: {
        statusCode: 500,
        msg: 'DB관련한 에러 메시지 + ~에서 일어난 에러입니다.',
        err: 'InternalServerErrorException',
      },
    },
  })
  @HttpCode(HTTP_STATUS_CODE.success.ok)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
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

  @ApiOperation({
    summary: '스펙 등록 API',
    description: '스펙을 등록해주는 API입니다.',
  })
  @ApiOkResponse({
    description: '성공적으로 스펙등록이 되었습니다.',
    schema: {
      example: {
        statusCode: 201,
        msg: '성공적으로 스펙등록이 되었습니다.',
      },
    },
  })
  @ApiBadRequestResponse({
    description:
      '스펙등록시 사진을 업로드 하지 않았다면 기본사진을 넣어주셔야 합니다.',
    schema: {
      example: {
        statusCode: 400,
        msg: '사진을 선택하지 않은 경우 기본사진을 넣어주셔야 스펙 등록이 가능 합니다.',
        err: 'Bad Request',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: '요청에 대한 응답 처리중 서버에러가 발생한 경우',
    schema: {
      example: {
        statusCode: 500,
        msg: 'DB관련한 에러 메시지 + ~에서 일어난 에러입니다.',
        err: 'InternalServerErrorException',
      },
    },
  })
  @HttpCode(HTTP_STATUS_CODE.success.created)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FilesInterceptor('image', 10))
  @Post('regist')
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
      msg: '성공적으로 스펙등록이 되었습니다.',
    };
  }

  @ApiOperation({
    summary: '스펙 수정 API',
    description: '스펙을 수정할 때 사용되는 API입니다.',
  })
  @ApiOkResponse({
    description: '성공적으로 스펙이 수정 경우.',
    schema: {
      example: {
        statusCode: 200,
        msg: '성공적으로 스펙이 수정되었습니다.',
      },
    },
  })
  @ApiNotFoundResponse({
    description:
      '수정하려는 스펙이 DB에 존재하지 않는 경우(혹시모를 예외처리임)',
    schema: {
      example: {
        statusCode: 404,
        msg: '해당 스펙이 존재하지 않습니다.',
        err: 'Not Found',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: '요청에 대한 응답 처리중 서버에러가 발생한 경우',
    schema: {
      example: {
        statusCode: 500,
        msg: 'DB관련한 에러 메시지 + ~에서 일어난 에러입니다.',
        err: 'InternalServerErrorException',
      },
    },
  })
  @HttpCode(HTTP_STATUS_CODE.success.ok)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FilesInterceptor('image', 10))
  @Patch(':specNo')
  async updateSpec(
    @Param('specNo') specNo: number,
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
    if (originSpecPhotoUrls) {
      await this.awsService.deleteSpecS3Object(originSpecPhotoUrls);
    }

    return {
      msg: '성공적으로 스펙이 수정되었습니다.',
    };
  }

  @ApiOperation({
    summary: '스펙 삭제 API',
    description: '스펙을 삭제한다',
  })
  @ApiOkResponse({
    description: '성공적으로 스펙이 삭제된 경우.',
    schema: {
      example: {
        statusCode: 200,
        msg: '성공적으로 스펙을 삭제하였습니다.',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: '요청에 대한 응답 처리중 서버에러가 발생한 경우',
    schema: {
      example: {
        statusCode: 500,
        msg: 'DB관련한 에러 메시지 + ~에서 일어난 에러입니다.',
        err: 'InternalServerErrorException',
      },
    },
  })
  @HttpCode(HTTP_STATUS_CODE.success.ok)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Delete(':specNo')
  async deleteSpec(
    @Param('specNo') specNo: number,
    @CurrentUser() user: User,
  ): Promise<object> {
    const originSpecPhotoUrls = await this.specsService.deleteSpec(
      specNo,
      user.no,
    );

    if (originSpecPhotoUrls) {
      await this.awsService.deleteSpecS3Object(originSpecPhotoUrls);
    }

    return {
      msg: '성공적으로 스펙을 삭제하였습니다.',
    };
  }
}
