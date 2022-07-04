import { Controller, Get, Logger, Param, ParseIntPipe } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ApiTags } from '@nestjs/swagger';
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

  @Get('/popular')
  async readHotCategories() {
    const response = await this.categoryService.readHotCategories();

    return Object.assign({
      statusCode: 200,
      msg: `인기 카테고리 조회 완료`,
      response,
    });
  }
}
