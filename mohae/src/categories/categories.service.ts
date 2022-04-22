import { Injectable, NotFoundException } from '@nestjs/common';
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
    const categories = await this.categoryRepository.findAllCategory();

    return categories;
  }

  async findOneCategory(no: number): Promise<Category> {
    const category = await this.categoryRepository.findOneCategory(no);

    if (!category) {
      throw new NotFoundException(
        `${no}에 해당하는 카테고리를 찾을 수 없습니다.`,
      );
    }
    return category;
  }
}
