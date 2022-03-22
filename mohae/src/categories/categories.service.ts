import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entity/category.entity';
import { CategoryRepository } from './repository/category.repository';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryRepository)
    private categoryRepository: CategoryRepository,
  ) {}

  async findAllCategories(): Promise<Category[]> {
    try {
      const categories = await this.categoryRepository.findAllCategory();

      return categories;
    } catch (e) {
      console.log(e);
    }
  }

  findOneCategory(no: number): Promise<Category> {
    return this.categoryRepository.findOne(no);
  }
}
