import {
  Controller,
  Get,
  HttpCode,
  Logger,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HTTP_STATUS_CODE } from 'src/common/configs/http-status.config';
import { operationConfig } from 'src/common/swagger-apis/api-operation.swagger';
import { apiResponse } from 'src/common/swagger-apis/api-response.swagger';
import { CategoriesService } from './categories.service';
import { Category } from './entity/category.entity';

@Controller('categories')
@ApiTags('Categories')
export class CategoriesController {
  private logger = new Logger('CategoriesController');
  constructor(private categoryService: CategoriesService) {}

  @Get()
  async findAllCategories(): Promise<Category[]> {
    this.logger.verbose(`카테고리 전체 조회 시도.`);
    const response = await this.categoryService.findAllCategories();

    return Object.assign({
      statusCode: 200,
      msg: `카테고리 전체 조회 완료`,
      response,
    });
  }

  @ApiOperation(operationConfig('게시글 검색 경로', '게시글 검색 API'))
  @ApiOkResponse(
    apiResponse.success(
      '성공여부',
      HTTP_STATUS_CODE.success.ok,
      '인기 카테고리 조회 완료',
      [
        {
          category: '디자인',
        },
        {
          category: '사진/영상',
        },
        {
          category: 'IT/개발',
        },
        {
          category: 'All',
        },
        {
          category: '컨설팅',
        },
      ],
    ),
  )
  @HttpCode(HTTP_STATUS_CODE.success.ok)
  @Get('/popular')
  async readHotCategories(): Promise<object> {
    const response: Category[] = await this.categoryService.readHotCategories();

    return {
      msg: `인기 카테고리 조회 완료`,
      response,
    };
  }
}
