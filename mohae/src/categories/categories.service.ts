import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entity/category.entity';
import { CategoryRepository } from './repository/category.repository';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryRepository)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async findAllCategories(): Promise<Category[]> {
    const categories = await this.categoryRepository.findAllCategory();

    return categories;
  }

  async readHotCategories(): Promise<Category[]> {
    try {
      const categories: Category[] =
        await this.categoryRepository.readHotCategories();

      return categories;
    } catch (err) {
      throw err;
    }
  }
}
