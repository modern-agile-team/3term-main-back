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
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from 'src/auth/entity/user.entity';
import { Spec } from './entity/spec.entity';
import { AwsService } from 'src/aws/aws.service';
import { OneSpec, SpecsService } from './specs.service';
import { HTTP_STATUS_CODE } from 'src/common/configs/http-status.config';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CreateSpecDto } from './dto/create-spec.dto';
import { UpdateSpecDto } from './dto/update-spec.dto';
import { specSwagger } from './specs.swagger';
import { operationConfig } from 'src/common/swagger-apis/api-operation.swagger';

@ApiTags('Specs')
@UseGuards(AuthGuard('jwt-refresh-token'))
@Controller('specs')
export class SpecsController {
  constructor(
    private readonly specsService: SpecsService,
    private readonly awsService: AwsService,
  ) {}

  @ApiOperation(
    operationConfig('스펙 상세조회 API', '하나의 스펙을 불러와 줍니다.'),
  )
  @ApiOkResponse(specSwagger.getOneSpec.success)
  @ApiNotFoundResponse(specSwagger.getOneSpec.notFoundResponse)
  @ApiInternalServerErrorResponse(specSwagger.internalServerErrorResponse)
  @HttpCode(HTTP_STATUS_CODE.success.ok)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt-refresh-token'))
  @Get('spec/:specNo')
  async getOneSpec(@Param('specNo') specNo: number): Promise<object> {
    const response: OneSpec = await this.specsService.getOneSpec(specNo);

    return {
      msg: '성공적으로 스펙을 불러왔습니다.',
      response,
    };
  }

  @ApiOperation(
    operationConfig(
      '프로필 페이지 스펙 불러오는 API',
      '프로필 페이지에서 스펙을 조회할 때 사용되는 api입니다.',
    ),
  )
  @ApiOkResponse(specSwagger.readUserSpec.success)
  @ApiInternalServerErrorResponse(specSwagger.internalServerErrorResponse)
  @HttpCode(HTTP_STATUS_CODE.success.ok)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt-refresh-token'))
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

  @ApiOperation(
    operationConfig('스펙 등록 API', '스펙을 등록해주는 API입니다.'),
  )
  @ApiOkResponse(specSwagger.registSpec.success)
  @ApiBadRequestResponse(specSwagger.registSpec.badRequestResponse)
  @ApiInternalServerErrorResponse(specSwagger.internalServerErrorResponse)
  @HttpCode(HTTP_STATUS_CODE.success.created)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt-refresh-token'))
  @UseInterceptors(FilesInterceptor('image', 10))
  @Post('regist')
  async registSpec(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createSpecDto: CreateSpecDto,
    @CurrentUser() user: User,
  ): Promise<object> {
    await this.specsService.registSpec(user.no, createSpecDto, files);

    return {
      msg: '성공적으로 스펙등록이 되었습니다.',
    };
  }

  @ApiOperation(
    operationConfig('스펙 수정 API', '스펙을 수정할 때 사용되는 API입니다.'),
  )
  @ApiOkResponse(specSwagger.updateSpec.success)
  @ApiNotFoundResponse(specSwagger.updateSpec.notFoundResponse)
  @ApiForbiddenResponse(specSwagger.updateSpec.forbiddenResponse)
  @ApiInternalServerErrorResponse(specSwagger.internalServerErrorResponse)
  @HttpCode(HTTP_STATUS_CODE.success.ok)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt-refresh-token'))
  @UseInterceptors(FilesInterceptor('image', 10))
  @Patch(':specNo')
  async updateSpec(
    @Param('specNo') specNo: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() updateSpecdto: UpdateSpecDto,
    @CurrentUser() user: User,
  ): Promise<object> {
    await this.specsService.updateSpec(user.no, specNo, updateSpecdto, files);

    return {
      msg: '성공적으로 스펙이 수정되었습니다.',
    };
  }

  @ApiOperation(operationConfig('스펙 삭제 API', '스펙을 삭제한다'))
  @ApiOkResponse(specSwagger.deleteSpec.success)
  @ApiForbiddenResponse(specSwagger.deleteSpec.forbiddenResponse)
  @ApiInternalServerErrorResponse(specSwagger.internalServerErrorResponse)
  @HttpCode(HTTP_STATUS_CODE.success.ok)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt-refresh-token'))
  @Delete(':specNo')
  async deleteSpec(
    @Param('specNo') specNo: number,
    @CurrentUser() user: User,
  ): Promise<object> {
    await this.specsService.deleteSpec(specNo, user.no);

    return {
      msg: '성공적으로 스펙을 삭제하였습니다.',
    };
  }
}
