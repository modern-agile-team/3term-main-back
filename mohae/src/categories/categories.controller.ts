import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './entity/category.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private categoryService: CategoriesService) {}

  @Get()
  findAllCategories(): Promise<Category[]> {
    return this.categoryService.findAllCategories();
  }
}
