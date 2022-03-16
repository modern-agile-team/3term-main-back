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
  findAllCategories(): Promise<Category[]> {
    this.logger.verbose(`카테고리 전체 조회 시도.`);
    return this.categoryService.findAllCategories();
  }

  @Get('/:no')
  findOneCategory(@Param('no', ParseIntPipe) no: number): Promise<Category> {
    this.logger.verbose(`카테고리 선택 조회 시도. 카테고리 번호 : ${no}`);
    return this.categoryService.findOneCategory(no);
  }
}
