import { Controller, Get, Logger, Param, ParseIntPipe } from '@nestjs/common';
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

  @Get('/:no')
  async findOneCategory(
    @Param('no', ParseIntPipe) no: number,
  ): Promise<Category> {
    this.logger.verbose(`카테고리 선택 조회 시도. 카테고리 번호 : ${no}`);
    const response = await this.categoryService.findOneCategory(no);

    return Object.assign({
      statusCode: 200,
      msg: `카테고리 전체 조회 완료`,
      response,
    });
  }
}
